import { nodeDistance } from "./distance.ts";
import { serpentine as gravity } from "./force.ts";
import { Node, Sides } from "./node.ts";

/** Apply gravitation force to a node towards center of parent */
function nodeForce(node: Node): void {
  if (!node.parent) return;
  const parent: Node = node.parent;
  const eps = 1;

  // Distance from center
  // console.log(parent);
  const distance: Sides = nodeDistance(
    node.position,
    [parent.x, parent.y, parent.x, parent.y],
  );

  // Pull sides with positive distance
  const force = [0, 1, 2, 3].map((i) =>
    // distance[i] > 0 ? gravity(distance[i], eps) : 0
    distance[i] > 0 ? distance[i] : 0
  ) as Sides;
  node.applyForce(force);
}

/* Apply centering force recursively for all children towards parent center */
export function centerForce(tree: Node): void {
  tree.children.forEach((c) => {
    nodeForce(c);
    centerForce(c);
  });
}
