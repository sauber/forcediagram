import { Node, Sides } from "../element/mod.ts";
import { Force } from "./types.ts";

/** Edges of nodes pull towards canvas grid lines
 * Grid interval defaults to 8 (typical terminal character width/height)
 */
export const gridForce: Force = (node: Node): Sides => {
  if (!node.parent) return [0, 0, 0, 0] as Sides;
  const gridSize = 8;

  // Pull each side towards nearest grid line
  const toGrid = (value: number): number => {
    const nearest = Math.round(value / gridSize) * gridSize;
    return (nearest - value) * 0.01;
  };

  const force: Sides = [
    toGrid(node.left),
    toGrid(node.bottom),
    toGrid(node.right),
    toGrid(node.top),
  ];

  return force;
};
