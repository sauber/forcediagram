import { nodeDistance } from "../element/mod.ts";
import { Node, Sides } from "../element/mod.ts";
import { Force } from "./types.ts";

/** Apply gravitation force to a node towards center of parent.
 * This helps to compact nodes and minimize parent size.
 * Stronger pull for heavier nodes relative to sibling.
 * Force is strongest halfway to the edge, then tapers off to nearly 0 at the edge.
 * Force tapers off to 0 at the center when node reaches or overlaps it.
 * Maxiumm force is 1, which occurs when the largest node is halfway to the edge of the parent.
 */
export const centerForce: Force = (node: Node): Sides => {
  // Only applies to children, not root
  if (!node.parent) return [0, 0, 0, 0] as Sides;
  const parent: Node = node.parent;

  // Distance from center
  const distance: Sides = nodeDistance(
    node.position,
    [parent.x, parent.y, parent.x, parent.y],
  );

  // Distance relative to maxdistance
  const maxDistance: number = Math.max(parent.width, parent.height) / 2;
  const relativeDistance: Sides = distance.map((d) => d / maxDistance) as Sides;

  // Size relative to largest sibling
  const largestSiblingMass: number = Math.max(
    1,
    ...parent.children.map((sibling) => sibling.mass),
  );
  const massFactor: number = node.mass / largestSiblingMass;

  // Pull sides with positive distance
  const force: Sides = relativeDistance.map(
    (d) => d > 0 ? massFactor / (1 + (Math.abs(d - 0.5) / 0.5) ** 2) : 0,
  ) as Sides;

  return force;
};
