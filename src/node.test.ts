import {
  assertEquals,
  assertGreater,
  assertLess,
  assertThrows,
} from "@std/assert";
import { Node, Sides, Text } from "./node.ts";

Deno.test("Node properties", () => {
  const [x1, y1, x2, y2]: Sides = [0, 0, 10, 10];
  const node = new Node([x1, y1, x2, y2]);
  assertEquals(node.position, [x1, y1, x2, y2]);
  assertEquals(node.left, x1);
  assertEquals(node.bottom, y1);
  assertEquals(node.right, x2);
  assertEquals(node.top, y2);
  assertEquals(node.width, x2 - x1);
  assertEquals(node.height, y2 - y1);
  assertEquals(node.mass, (x2 - x1) * (y2 - y1));
  assertEquals(node.x, (x2 - x1) / 2 + x1);
  assertEquals(node.y, (y2 - y1) / 2 + y1);
});

Deno.test("Text Properties", () => {
  const [center, middle] = [10, 10];
  const text = new Text("hi", center, middle);
  assertEquals(text.label, "hi");
  assertEquals(text.x, center);
  assertEquals(text.y, middle);
  assertLess(text.left, center);
  assertLess(text.bottom, middle);
  assertGreater(text.right, center);
  assertGreater(text.top, middle);
  assertGreater(text.width, 0);
  assertGreater(text.height, 0);
  assertEquals(text.mass, text.width * text.height);
});

Deno.test("Node Children", () => {
  const [x1, y1, x2, y2]: Sides = [0, 0, 10, 10];
  const node = new Node([x1, y1, x2, y2]);
  assertEquals(node.children.length, 0);
  const child: Node = node.addNode();
  assertEquals(node.children.length, 1);

  // Confirm child within edges of parent
  assertGreater(child.left, x1);
  assertGreater(child.bottom, y1);
  assertLess(child.right, x2);
  assertLess(child.top, y2);

  // Add text child
  node.addText("hi");
  assertEquals(node.children.length, 2);
});

Deno.test("Text children", () => {
  const text = new Text("hi", 10, 10);
  assertEquals(text.children.length, 0);
  assertThrows(() => text.addNode());
  assertThrows(() => text.addText("hi"));
});

Deno.test("Apply force", () => {
  const [x1, y1, x2, y2]: Sides = [0, 0, 10, 10];
  const node = new Node([x1, y1, x2, y2]);
  const f = 1; // Force
  const force: Sides = [f, f, f, f];
  node.applyForce(force);
  const v = f / node.mass; // Velocity
  assertEquals(node.velocity, [v, v, v, v]);
});

Deno.test("Enlarge", () => {
  const [x1, y1, x2, y2]: Sides = [0, 0, 10, 10];
  const node = new Node([x1, y1, x2, y2]);
  const f = 1;
  const mass = node.mass;
  const d = f / mass * 0.01;
  const force: Sides = [f, f, f, f];
  node.applyForce(force);
  node.move();
  assertEquals(node.position, [x1 - d, y1 - d, x2 + d, y2 + d]);
  assertGreater(node.mass, mass);
});

Deno.test("Shrink", () => {
  const [x1, y1, x2, y2]: Sides = [0, 0, 10, 10];
  const node = new Node([x1, y1, x2, y2]);
  const f = -2;
  const mass = node.mass;
  const d = f / mass * 0.01;
  const force: Sides = [f, f, f, f];
  node.applyForce(force);
  node.move();
  assertEquals(node.position, [x1 - d, y1 - d, x2 + d, y2 + d]);
  assertLess(node.mass, mass);
});
