import { Node, Sides } from "../element/mod.ts";
import { Force } from "./types.ts";

/** Sibling nodes pull towards having same size
 * For each sibling pair, width and height pull towards average
 */
export const sizeForce: Force = (node: Node): Sides => {
  if (!node.parent) return [0, 0, 0, 0] as Sides;
  const siblings = node.parent.children.filter((c) => c !== node);
  if (siblings.length === 0) return [0, 0, 0, 0] as Sides;

  // Average width and height of siblings
  const avgWidth = siblings.reduce((sum, s) => sum + s.width, 0) /
    siblings.length;
  const avgHeight = siblings.reduce((sum, s) => sum + s.height, 0) /
    siblings.length;

  if (avgWidth === 0 && avgHeight === 0) return [0, 0, 0, 0] as Sides;

  // Pull width towards average
  const widthDiff = node.width - avgWidth;
  const heightDiff = node.height - avgHeight;

  const force: Sides = [
    -widthDiff * 0.01, // Left moves left/right based on width diff
    0, // Bottom stays
    widthDiff * 0.01, // Right moves based on width diff
    0, // Top stays
  ];

  // Pull height towards average (only for non-text nodes)
  if (!("label" in node)) {
    force[1] = -heightDiff * 0.01; // Bottom moves
    force[3] = heightDiff * 0.01; // Top moves
  }

  return force;
};
