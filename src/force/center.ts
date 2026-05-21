import { nodeDistance } from "../element/distance.ts";
import { Node, Sides } from "../element/node.ts";
import { Force } from "./types.ts";

/** Apply gravitation force to a node towards center of parent */
export const centerForce: Force = (node: Node): Sides => {
  if (!node.parent) return [0, 0, 0, 0] as Sides;
  const parent: Node = node.parent;
  // const eps = 1;

  // Distance from center
  const distance: Sides = nodeDistance(
    node.position,
    [parent.x, parent.y, parent.x, parent.y],
  );

  // Pull sides with positive distance
  const force = [0, 1, 2, 3].map((i) =>
    // distance[i] > 0 ? gravity(distance[i], eps) : 0
    distance[i] > 0 ? distance[i] * Math.min(1, node.mass) : 0
  ) as Sides;
  return force;
};
