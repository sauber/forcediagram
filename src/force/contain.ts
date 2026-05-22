import { nodeDistance } from "../element/distance.ts";
import { Node, Sides } from "../element/node.ts";
import { Force } from "./types.ts";

/** Children repulse from parents
 * ]-2;-1[ child overlaps
 * -1 sides touch
 * ]-1:0[ sides apart
 */
export const containmentForce: Force = (node: Node): Sides => {
  // Does not apply to root node
  if (!node.parent) return [0, 0, 0, 0] as Sides;

  // Distance between opposite sides
  const distance: Sides = nodeDistance(node.position, node.parent.position);

  // Repulsive forces
  const m = node.mass;
  const force: Sides = distance.map((x) => Math.tanh(x / m) - 1) as Sides;
  console.log({ distance, force });

  return force;
};
