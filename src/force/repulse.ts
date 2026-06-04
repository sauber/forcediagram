import { Node, Sides } from "../element/node.ts";
import { Force } from "./types.ts";

// TODO: Break up into smaller functions for better testability and readability

// Calculate by how much area is node A overlapped by node B
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

/** Apply repulsion force to siblings
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
  const parent: Node = node.parent;

  const siblings = parent.children.filter((child) => child !== node);
  if (siblings.length === 0) return [0, 0, 0, 0];

  const force: Sides = [0, 0, 0, 0];

  siblings.forEach((sibling: Node) => {
    // Distance to edges of sibling
    const distance: Sides = [
      node.left - sibling.right,
      node.bottom - sibling.top,
      sibling.left - node.right,
      sibling.bottom - node.top,
    ];

    // Overlap handling
    const overlap = overlapRatio(node.position, sibling.position);
    if (overlap > 0) {
      // Choose the side with the deepest penetration (most negative)
      const deepest = Math.min(...distance.filter((d) => d < 0));
      const sideIndex = distance.findIndex((d) => d === deepest);
      // Strong repulsion using tanh: full overlap => ~-1.76, no overlap => 0
      const magnitude = Math.tanh(-overlap) - 1;
      force[sideIndex] += magnitude;
    }

    // Touching sides (distance == 0) -> repulsion -1
    distance.forEach((d, i) => {
      if (d === 0) {
        force[i] += -1;
      }
    });

    // Aligned side repulsion
    const verticalOverlap = Math.min(node.top, sibling.top) -
      Math.max(node.bottom, sibling.bottom);
    const horizontalOverlap = Math.min(node.right, sibling.right) -
      Math.max(node.left, sibling.left);

    // If vertically aligned (overlap in Y) and separated horizontally
    if (verticalOverlap > 0) {
      // left side
      if (distance[0] > 0) {
        force[0] += -1 / distance[0];
      }
      // right side
      if (distance[2] > 0) {
        force[2] += -1 / distance[2];
      }
    }

    // If horizontally aligned (overlap in X) and separated vertically
    if (horizontalOverlap > 0) {
      // bottom side
      if (distance[1] > 0) {
        force[1] += -1 / distance[1];
      }
      // top side
      if (distance[3] > 0) {
        force[3] += -1 / distance[3];
      }
    }
  });
  return force;
};
