import { assertGreater } from "@std/assert";
import { centerForce } from "./center.ts";
import { Node, Text } from "../element/mod.ts";

Deno.test("Centering Node", () => {
  const width = 100, height = 100;
  const canvas = new Node([0, 0, width, height]);
  const [c, m] = [width / 2, height / 2];
  const node: Node = canvas.addNode();

  // Apply centering forces
  const force = centerForce(node);

  // Child node left of center should cause force towards right
  if (node.right < c) assertGreater(force[2], 0);
  // Child node right of center
  if (node.left > c) assertGreater(force[0], 0);
  // Child node bottom of center
  if (node.top < m) assertGreater(force[3], 0);
  // Child node top of center
  if (node.bottom > m) assertGreater(force[1], 0);
});

Deno.test("Centering Text", () => {
  const width = 100, height = 100;
  const canvas = new Node([0, 0, width, height]);
  const text: Text = canvas.addText("hi", 2, 1);
  const [c, m] = [width / 2, height / 2];

  // Apply centering forces
  const force = centerForce(text);

  // Implementation for centering text test
  // Child node left of center should cause force towards right
  if (text.right < c) assertGreater(force[2], 0);
  // Child node right of center
  if (text.left > c) assertGreater(force[0], 0);
  // Child node bottom of center
  if (text.top < m) assertGreater(force[3], 0);
  // Child node top of center
  if (text.bottom > m) assertGreater(force[1], 0);
});
