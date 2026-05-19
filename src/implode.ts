import { agnesi as gravity } from "./force.ts";
import { Node, Sides } from "./node.ts";

// const snap = (x: number): number => 2 * x / (x * x + 1);

/** Apply inwards gravity between opposite edges */
function nodeImplodeForce(node: Node): void {
  // Distance between opposite sides
  const distance: Sides = [
    node.width, // Left-Right
    node.height, // Bottom-Top
    node.width, // Right-Left
    node.height, // Top-Bottom
  ];

  // Apply repulsion to pull edges inward (negative force)
  // const mass = node.mass;
  // const force = distance.map((d) => repulsion(d)) as Sides;
  // const force = distance.map((d) => gravity(-d) / mass / 2) as Sides;
  // const force = distance.map((d) => 1 / (d + 1) - d) as Sides;
  const force = distance.map((d) => 2 / (d * d + 0.5) - d) as Sides;
  // const force = distance.map((d) => -d / 4) as Sides;
  // console.log("implode force", force);
  // console.log({ distance, force });
  node.applyForce(force);
}

/* Apply imploding force recursively */
export function implodeForce(tree: Node): void {
  nodeImplodeForce(tree);
  tree.children.forEach((c) => {
    implodeForce(c);
  });
}
