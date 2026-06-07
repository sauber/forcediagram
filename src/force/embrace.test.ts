import { assertEquals, assertGreater, assertLess } from "@std/assert";
import { Node } from "../element/mod.ts";
import { embraceForce } from "./embrace.ts";

function link(parent: Node, child: Node): void {
  parent.children.push(child);
  child.parent = parent;
}

Deno.test("Bottom and left touch sides", () => {
  const root: Node = new Node([0, 0, 100, 100]);
  const parent: Node = new Node([0, 0, 100, 100]);
  const child: Node = new Node([0, 0, 10, 10]);

  link(root, parent);
  link(parent, child);

  const force = embraceForce(parent);

  assertEquals(force[0], 1);
  assertEquals(force[1], 1);
  assertLess(force[2], 1);
  assertLess(force[3], 1);
});

Deno.test("Right and top touch sides", () => {
  const root: Node = new Node([0, 0, 100, 100]);
  const parent: Node = new Node([0, 0, 100, 100]);
  const child: Node = new Node([90, 90, 100, 100]);

  link(root, parent);
  link(parent, child);

  const force = embraceForce(parent);

  assertLess(force[0], 1);
  assertLess(force[1], 1);
  assertEquals(force[2], 1);
  assertEquals(force[3], 1);
});

Deno.test("Bottom Left Overlapping child", () => {
  const root: Node = new Node([0, 0, 100, 100]);
  const parent: Node = new Node([0, 0, 100, 100]);
  const child: Node = new Node([-50, -50, 50, 50]);

  link(root, parent);
  link(parent, child);

  const force = embraceForce(parent);

  assertGreater(force[0], 1);
  assertGreater(force[1], 1);
  assertLess(force[2], 1);
  assertLess(force[3], 1);
});

Deno.test("Top Right Overlapping child", () => {
  const root: Node = new Node([0, 0, 100, 100]);
  const parent: Node = new Node([0, 0, 100, 100]);
  const child: Node = new Node([50, 50, 150, 150]);

  link(root, parent);
  link(parent, child);

  const force = embraceForce(parent);

  assertLess(force[0], 1);
  assertLess(force[1], 1);
  assertGreater(force[2], 1);
  assertGreater(force[3], 1);
});
