import { assertGreater } from "@std/assert";
import { centerForce } from "./center.ts";
import { Node, Text } from "./node.ts";

Deno.test("Centering", () => {
  const width = 100;
  const height = 100;
  const [c, m] = [width / 2, height / 2];

  const canvas = new Node([0, 0, 100, 100]);
  const text: Text = canvas.addText("hi");

  // Apply centering forces
  centerForce(canvas);

  // Child node left of center should cause force towards right
  if (text.right < c) assertGreater(text.velocity[2], 0);
  // Child node right of center
  if (text.left > c) assertGreater(text.velocity[0], 0);
  // Child node bottom of center
  if (text.top < m) assertGreater(text.velocity[3], 0);
  // Child node top of center
  if (text.bottom > m) assertGreater(text.velocity[1], 0);
});
