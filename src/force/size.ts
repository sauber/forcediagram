import { Node, Sides } from "../element/mod.ts";
import { Force } from "./types.ts";
import { serpentine } from "./force.ts";

/** Sibling nodes pull towards having same size
 * For each sibling pair, width and height pull towards average
 */
export const sizeForce: Force = (node: Node): Sides => {
  if (!node.parent) return [0, 0, 0, 0] as Sides;
  const siblings = node.parent.children.filter((c) => c !== node);
  if (siblings.length === 0) return [0, 0, 0, 0] as Sides;

  // Average mass of siblings
  const avgMass = siblings.reduce((sum, s) => sum + s.mass, 0) /
    siblings.length;
  if (avgMass === 0) return [0, 0, 0, 0] as Sides;

  // Mass ratio: positive when node is larger (shrink), negative when smaller (expand)
  const massRatio = (node.mass - avgMass) / avgMass;

  // Serpentine ensures force magnitude in [-1, 1]
  const f = serpentine(-massRatio) / 2;

  // Same force to all sides to grow or shrink size
  const force: Sides = [f, f, f, f];

  return force;
};
