import { Node, Sides } from "../element/mod.ts";
import { Force } from "./types.ts";

const MARGIN = 2;

export const guardrailForce: Force = (node: Node): Sides => {
  if (!node.parent || node.parent.parent) return [0, 0, 0, 0] as Sides;
  const canvas = node.parent;
  const force: Sides = [0, 0, 0, 0];
  const dLeft = node.left - canvas.left;
  const dBottom = node.bottom - canvas.bottom;
  const dRight = canvas.right - node.right;
  const dTop = canvas.top - node.top;

  if (dLeft < MARGIN) {
    force[0] = Math.tanh(dLeft - MARGIN) - 1;
  }
  if (dBottom < MARGIN) {
    force[1] = Math.tanh(dBottom - MARGIN) - 1;
  }
  if (dRight < MARGIN) {
    force[2] = Math.tanh(dRight - MARGIN) - 1;
  }
  if (dTop < MARGIN) {
    force[3] = Math.tanh(dTop - MARGIN) - 1;
  }
  return force;
};
