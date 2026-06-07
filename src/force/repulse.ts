import { Node, Sides } from "../element/mod.ts";
import { Force } from "./types.ts";

/** Sum multiple Sides vectors element-wise into one
 * @param sides one or more Sides vectors to sum */
const addSides = (...sides: Sides[]): Sides => {
  const result: Sides = [0, 0, 0, 0];
  sides.forEach((s) => s.forEach((v, i) => result[i] += v));
  return result;
};

/** @returns [left, bottom, right, top] signed distances from node A's edges to node B's opposite edges
 * @param a first node
 * @param b second node */
export const edgeDistances = (a: Node, b: Node): Sides => [
  a.left - b.right,
  a.bottom - b.top,
  b.left - a.right,
  b.bottom - a.top,
];

/** @returns [vertical, horizontal] overlap of the two rectangles' projections on each axis (may be negative when separated)
 * @param a first rectangle Sides
 * @param b second rectangle Sides */
export const projectionOverlap = (a: Sides, b: Sides): [number, number] => [
  Math.min(a[3], b[3]) - Math.max(a[1], b[1]),
  Math.min(a[2], b[2]) - Math.max(a[0], b[0]),
];

/** @returns fraction of A's area overlapped by B (0 = none, 1 = fully)
 * @param a first rectangle Sides
 * @param b second rectangle Sides */
export const overlapRatio = (a: Sides, b: Sides): number => {
  const overlapWidth = Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0]));
  const overlapHeight = Math.max(
    0,
    Math.min(a[3], b[3]) - Math.max(a[1], b[1]),
  );
  const overlapArea = overlapWidth * overlapHeight;
  const aArea = (a[2] - a[0]) * (a[3] - a[1]);
  return aArea > 0 ? overlapArea / aArea : 0;
};

/** @returns repulsion force on the side with deepest penetration
 * @param distance edge distances to sibling
 * @param overlap overlap ratio (0..1) */
export const overlapForce = (distance: Sides, overlap: number): Sides => {
  if (overlap <= 0) return [0, 0, 0, 0];
  const deepest = Math.max(...distance.filter((d) => d < 0));
  const sideIndex = distance.findIndex((d) => d === deepest);
  const magnitude = Math.tanh(-overlap) - 1;
  const result: Sides = [0, 0, 0, 0];
  result[sideIndex] = magnitude;
  return result;
};

/** @returns -1 on each side where distance is exactly 0
 * @param distance edge distances to sibling */
export const touchingForce = (distance: Sides): Sides =>
  distance.map((d) => (d === 0 ? -1 : 0)) as Sides;

/** @returns repulsion on sides facing the sibling when projections overlap on one axis
 * @param distance edge distances to sibling
 * @param verticalOverlap overlap of Y-axis projections
 * @param horizontalOverlap overlap of X-axis projections */
export const alignedForce = (
  distance: Sides,
  verticalOverlap: number,
  horizontalOverlap: number,
): Sides => {
  const result: Sides = [0, 0, 0, 0];
  if (verticalOverlap > 0) {
    if (distance[0] > 0) result[0] = -1 / distance[0];
    if (distance[2] > 0) result[2] = -1 / distance[2];
  }
  if (horizontalOverlap > 0) {
    if (distance[1] > 0) result[1] = -1 / distance[1];
    if (distance[3] > 0) result[3] = -1 / distance[3];
  }
  return result;
};

/** @returns repulsion proportional to angle when neither projection overlaps
 * @param node the node to compute force for
 * @param sibling the sibling node causing repulsion
 * @param verticalOverlap overlap of Y-axis projections
 * @param horizontalOverlap overlap of X-axis projections */
export const cornerForce = (
  node: Node,
  sibling: Node,
  verticalOverlap: number,
  horizontalOverlap: number,
): Sides => {
  if (verticalOverlap > 0 || horizontalOverlap > 0) return [0, 0, 0, 0];
  const centerX = (node.left + node.right) / 2;
  const centerY = (node.top + node.bottom) / 2;
  const siblingCenterX = (sibling.left + sibling.right) / 2;
  const siblingCenterY = (sibling.top + sibling.bottom) / 2;
  const dx = siblingCenterX - centerX;
  const dy = siblingCenterY - centerY;
  const totalDist = Math.abs(dx) + Math.abs(dy);
  if (totalDist <= 0) return [0, 0, 0, 0];
  const result: Sides = [0, 0, 0, 0];
  if (dx > 0) result[2] = -(Math.abs(dx) / totalDist);
  else if (dx < 0) result[0] = -(Math.abs(dx) / totalDist);
  if (dy > 0) result[3] = -(Math.abs(dy) / totalDist);
  else if (dy < 0) result[1] = -(Math.abs(dy) / totalDist);
  return result;
};

/** Apply repulsion force to siblings
 * @param node node to compute repulsion for
 * @returns accumulated repulsion force [left, bottom, right, top] from all siblings
 *
 * Possible situations
 *
 * 1. Overlapping nodes:
 *   ┌-----┐
 *   | A   |
 *   |  ┌--+--┐
 *   |  |  |  |
 *   └--+--┘ B|
 *      └-----┘
 * Force: Strong repulsion to shortest way out of the overlap
 *
 * 2. Partly aligned nodes:
 *   ┌-----┐
 *   | A   |
 *   |     | ┌----┐
 *   |     | | B  |
 *   └-----┘ |    |
 *           └----┘
 * Force: Repulsion to the aligned side. Magnitude depends on distance, mass and ratio of overlap.
 *
 * 3. Not aligned nodes:
 *  ┌-----┐
 *  | A   |
 *  └-----┘
 *           ┌-----┐
 *           | B   |
 *           └-----┘
 *
 * Force: Repulsion to the closest corner. Magnitude to each side depends on angle, distance and mass.
 */
export const repulsiveForce: Force = (node: Node): Sides => {
  if (!node.parent) return [0, 0, 0, 0];
  const parent = node.parent;
  const siblings = parent.children.filter((child) => child !== node);
  if (siblings.length === 0) return [0, 0, 0, 0];

  return siblings.reduce((force, sibling) => {
    const distance = edgeDistances(node, sibling);
    const [verticalOverlap, horizontalOverlap] = projectionOverlap(
      node.position,
      sibling.position,
    );
    const overlap = overlapRatio(node.position, sibling.position);

    return addSides(
      force,
      overlapForce(distance, overlap),
      touchingForce(distance),
      alignedForce(distance, verticalOverlap, horizontalOverlap),
      cornerForce(node, sibling, verticalOverlap, horizontalOverlap),
    );
  }, [0, 0, 0, 0] as Sides);
};
