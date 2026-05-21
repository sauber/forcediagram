import { Node, Sides } from "../element/node.ts";

/** For a node generate a force vector
 * Positive values indicate attraction, ie. side moves outwards.
 * Negative values indicate repulsion. ie. side moves inwards.
 */
export type Force = (node: Node) => Sides;
