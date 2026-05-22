import { Node, Sides } from "../element/node.ts";
import { Force } from "./types.ts";

/** Apply inwards gravity between opposite edges */
export const implodeForce: Force = (node: Node): Sides => {
  // Does not apply to root node
  if (!node.parent) return [0, 0, 0, 0] as Sides;

  // Distance between opposite sides
  const distance: Sides = [
    node.width, // Left-Right
    node.height, // Bottom-Top
    node.width, // Right-Left
    node.height, // Top-Bottom
  ];

  const force: Sides = distance.map((x) => 1 / (x + 1) - 1) as Sides;
  return force;
};
