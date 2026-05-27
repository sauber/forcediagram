import { assertLess } from "@std/assert";
import { edgeForce } from "./repulse.ts";
import { Node } from "../element/node.ts";

Deno.test("Avoid Edges", () => {
  const canvas = new Node([0, 0, 100, 100]);

  // Place nodes right on the edges of parent
  const left = new Node([0, 40, 20, 60]);
  canvas.addNode(left);
  const bottom = new Node([40, 0, 60, 20]);
  canvas.addNode(bottom);
  const right = new Node([80, 40, 100, 60]);
  canvas.addNode(right);
  const top = new Node([40, 80, 60, 100]);
  canvas.addNode(top);

  // Apply centering forces
  edgeForce(canvas);

  // Left node should repel left side
  assertLess(left.velocity[0], 0);

  // Bottom node should repel bottom
  assertLess(bottom.velocity[1], 0);

  // Right node should repel right side
  assertLess(right.velocity[2], 0);

  // Bottom node should repel bottom
  assertLess(top.velocity[3], 0);
});
