import { Sides } from "./node.ts";

/** Calculates the distance between two nodes
 * @param a - Origin node's sides [left, bottom, right, top]
 * @param b - Target node's sides [left, bottom, right, top]
 * @returns The distance from sides of node a to sides of node b: [left, bottom, right, top]
 */
export function nodeDistance(a: Sides, b: Sides): Sides {
  return [
    // Distance from left of node a to right of node b
    a[0] - b[2],
    // Distance from bottom of node a to top of node b
    a[1] - b[3],
    // Distance from right of node a to left of node b
    b[0] - a[2],
    // Distance from top of node a to bottom of node b
    b[1] - a[3],
  ];
}
