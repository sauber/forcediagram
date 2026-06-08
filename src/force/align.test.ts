import { assertEquals, assertGreater } from "@std/assert";
import { Node } from "../element/mod.ts";
import { alignForce } from "./align.ts";

Deno.test("No parent returns zero force", () => {
  const node = new Node([0, 0, 100, 100]);
  assertEquals(alignForce(node), [0, 0, 0, 0]);
});

Deno.test("No siblings returns zero force", () => {
  const parent = new Node([0, 0, 300, 300]);
  const node = new Node([0, 0, 100, 100]);
  parent.addNode(node);
  assertEquals(alignForce(node), [0, 0, 0, 0]);
});

Deno.test("Sibling to the right pulls node right edge outward", () => {
  const parent = new Node([0, 0, 300, 300]);
  const node = new Node([0, 0, 100, 100]);
  parent.addNode(node);
  const sibling = new Node([101, 0, 201, 100]);
  parent.addNode(sibling);
  const force = alignForce(node);
  assertGreater(force[2], 0);
});

Deno.test("Overlapping sibling pushes node right edge inward", () => {
  const parent = new Node([0, 0, 300, 300]);
  const node = new Node([0, 0, 100, 100]);
  parent.addNode(node);
  const sibling = new Node([99, 0, 199, 100]);
  parent.addNode(sibling);
  const force = alignForce(node);
  assertGreater(0, force[2]);
});

Deno.test("Sibling to the left pulls node left edge outward", () => {
  const parent = new Node([0, 0, 300, 300]);
  const node = new Node([0, 0, 100, 100]);
  parent.addNode(node);
  const sibling = new Node([-201, 0, -101, 100]);
  parent.addNode(sibling);
  const force = alignForce(node);
  assertGreater(force[0], 0);
});

Deno.test("Overlapping sibling pushes node left edge inward", () => {
  const parent = new Node([0, 0, 300, 300]);
  const node = new Node([0, 0, 100, 100]);
  parent.addNode(node);
  const sibling = new Node([-99, 0, 1, 100]);
  parent.addNode(sibling);
  const force = alignForce(node);
  assertGreater(0, force[0]);
});

Deno.test("Sibling above pulls node top edge outward", () => {
  const parent = new Node([0, 0, 300, 300]);
  const node = new Node([0, 0, 100, 100]);
  parent.addNode(node);
  const sibling = new Node([0, 101, 100, 201]);
  parent.addNode(sibling);
  const force = alignForce(node);
  assertGreater(force[3], 0);
});

Deno.test("Overlapping sibling pushes node top edge inward", () => {
  const parent = new Node([0, 0, 300, 300]);
  const node = new Node([0, 0, 100, 100]);
  parent.addNode(node);
  const sibling = new Node([0, 99, 100, 199]);
  parent.addNode(sibling);
  const force = alignForce(node);
  assertGreater(0, force[3]);
});

Deno.test("Sibling below pulls node bottom edge outward", () => {
  const parent = new Node([0, 0, 300, 300]);
  const node = new Node([0, 0, 100, 100]);
  parent.addNode(node);
  const sibling = new Node([0, -201, 100, -101]);
  parent.addNode(sibling);
  const force = alignForce(node);
  assertGreater(force[1], 0);
});

Deno.test("Overlapping sibling pushes node bottom edge inward", () => {
  const parent = new Node([0, 0, 300, 300]);
  const node = new Node([0, 0, 100, 100]);
  parent.addNode(node);
  const sibling = new Node([0, -99, 100, 1]);
  parent.addNode(sibling);
  const force = alignForce(node);
  assertGreater(0, force[1]);
});

Deno.test("Closer sibling pulls stronger than further sibling", () => {
  const parent = new Node([0, 0, 300, 300]);
  const node = new Node([0, 0, 100, 100]);
  parent.addNode(node);
  const close = new Node([101, 0, 201, 100]);
  parent.addNode(close);
  const closeForce = alignForce(node);
  parent.children.pop();
  const far = new Node([120, 0, 220, 100]);
  parent.addNode(far);
  const farForce = alignForce(node);
  parent.children.pop();
  assertGreater(closeForce[2], farForce[2]);
});

Deno.test("Heavier sibling pulls stronger than lighter sibling", () => {
  const parent = new Node([0, 0, 300, 300]);
  const node = new Node([0, 0, 100, 100]);
  parent.addNode(node);
  const light = new Node([103, 0, 203, 100]);
  parent.addNode(light);
  const lightForce = alignForce(node);
  parent.children.pop();
  const heavy = new Node([103, 0, 203, 200]);
  parent.addNode(heavy);
  const heavyForce = alignForce(node);
  parent.children.pop();
  assertGreater(heavyForce[2], lightForce[2]);
});
