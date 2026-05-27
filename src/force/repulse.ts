import { repulsion } from "./force.ts";
import { Node, Sides } from "../element/node.ts";

/** Apply repulsion force to siblings
 * Confirm that siblings are on the correct side
 * Directly opposite has stronger force than partly aligned sides, or sides not overlapping
 * TODO: Implementation
 */
function nodeEdgeForce(node: Node): void {
  if (!node.parent) return;
  const parent: Node = node.parent;

  // Distance of each node edge from corresponding parent edge
  const distance: Sides = [
    node.left - parent.left,
    node.bottom - parent.bottom,
    parent.right - node.right,
    parent.top - node.top,
  ];

  // Repel from parent edges when close
  const force = distance.map((d) => repulsion(d)) as Sides;
  node.applyForce(force);
}

/* Apply centering force recursively for all children towards parent center */
export function edgeForce(tree: Node): void {
  tree.children.forEach((c) => {
    nodeEdgeForce(c);
    edgeForce(c);
  });
}
