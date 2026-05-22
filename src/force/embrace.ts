import { Node, Sides } from "../element/node.ts";
import { Force } from "./types.ts";

/** Apply force on a parent node to move ourwards from children.
 * This helps to ensure frames are not overlapping children.
 * Pull force i 1 when sides touch.
 * Pull force tapers off approaching 0 as distance increase.
 * Pull force exponentially increases on overlap
 */
export const embraceForce: Force = (node: Node): Sides => {
  // Only applies to parents, not leaf nodes
  if (node.children.length < 1) return [0, 0, 0, 0] as Sides;

  // Do not apply force to root node
  if (!node.parent) return [0, 0, 0, 0] as Sides;

  // Min/max positions for all children
  const boundary: Sides = [
    Math.min(...node.children.map((c) => c.left)),
    Math.min(...node.children.map((c) => c.bottom)),
    Math.max(...node.children.map((c) => c.right)),
    Math.max(...node.children.map((c) => c.top)),
  ];

  // Distance from node sides to closest child
  const distance: Sides = [
    boundary[0] - node.left,
    boundary[1] - node.bottom,
    node.right - boundary[2],
    node.top - boundary[3],
  ];

  // Calculate force for each side based on closest child
  const force: Sides = distance.map((x) => 1 - Math.tanh(x)) as Sides;

  return force;
};
