import { Node, Sides } from "../element/mod.ts";
import { Force } from "./types.ts";

/** Sibling nodes pull towards aligning edges
 * For each sibling pair, edges that are close pull towards alignment
 */
export const alignForce: Force = (node: Node): Sides => {
  if (!node.parent) return [0, 0, 0, 0] as Sides;
  const siblings = node.parent.children.filter((c) => c !== node);
  if (siblings.length === 0) return [0, 0, 0, 0] as Sides;

  const force: Sides = [0, 0, 0, 0];
  for (const sibling of siblings) {
    const dx = Math.abs(node.x - sibling.x);
    const dy = Math.abs(node.y - sibling.y);
    const maxDist = Math.max(node.parent.width, node.parent.height);

    // Align left edges
    const leftDiff = sibling.left - node.left;
    if (Math.abs(leftDiff) < maxDist * 0.3) {
      force[0] += leftDiff * 0.01;
    }

    // Align bottom edges
    const bottomDiff = sibling.bottom - node.bottom;
    if (Math.abs(bottomDiff) < maxDist * 0.3) {
      force[1] += bottomDiff * 0.01;
    }

    // Align right edges
    const rightDiff = sibling.right - node.right;
    if (Math.abs(rightDiff) < maxDist * 0.3) {
      force[2] += rightDiff * 0.01;
    }

    // Align top edges
    const topDiff = sibling.top - node.top;
    if (Math.abs(topDiff) < maxDist * 0.3) {
      force[3] += topDiff * 0.01;
    }

    // Align centers horizontally
    if (dy < maxDist * 0.2) {
      force[0] += (sibling.x - node.x) * 0.005;
      force[2] += (sibling.x - node.x) * 0.005;
    }

    // Align centers vertically
    if (dx < maxDist * 0.2) {
      force[1] += (sibling.y - node.y) * 0.005;
      force[3] += (sibling.y - node.y) * 0.005;
    }
  }
  return force;
};
