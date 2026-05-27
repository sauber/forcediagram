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
  const innerDistance: Sides = [
    node.left - node.parent.left,
    node.bottom - node.parent.bottom,
    node.parent.right - node.right,
    node.parent.top - node.top,
  ];

  // Repulsive forces
  // const m = node.mass;
  const massRatio = node.mass / node.parent.mass;
  const force: Sides = innerDistance.map((x) =>
    Math.tanh(x * massRatio) - 1
  ) as Sides;
  // console.log({ innerDistance, force, massRatio });

  return force;
};
