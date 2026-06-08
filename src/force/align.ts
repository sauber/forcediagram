import { Node, nodeDistance, Sides } from "../element/mod.ts";
import { serpentine } from "./force.ts";
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
    // The heavier sibling, the stronger the force
    const massRatio = sibling.mass / node.mass;

    const distance: Sides = nodeDistance(node.position, sibling.position);

    // Apply stronger force for closer edges, weaker for farther edges
    distance.forEach((d, i) => force[i] += serpentine(d / massRatio));
  }
  return force;
};
