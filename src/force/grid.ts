import { Node, Sides } from "../element/mod.ts";
import { Force } from "./types.ts";

/** Edges of nodes pull towards canvas grid lines
 * @param - Grid interval
 */
export const gridForce = (gridSize: number): Force => (node: Node): Sides => {
  if (!node.parent) return [0, 0, 0, 0] as Sides;

  const nearest = (v: number) => Math.round(v / gridSize) * gridSize;
  const offset = (v: number) => v - nearest(v);

  // Left/bottom: positive = outward = moves to more negative coordinate
  // Right/top:   positive = outward = moves to more positive coordinate
  // Force sign must flip accordingly so both pull toward nearest grid line
  const force: Sides = [
    Math.sin(2 * Math.PI * offset(node.left) / gridSize),
    Math.sin(2 * Math.PI * offset(node.bottom) / gridSize),
    -Math.sin(2 * Math.PI * offset(node.right) / gridSize),
    -Math.sin(2 * Math.PI * offset(node.top) / gridSize),
  ];

  return force;
};
