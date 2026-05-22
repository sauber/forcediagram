import { assertEquals, assertNotEquals } from "@std/assert";
import { containmentForce } from "./contain.ts";
import { Node } from "../element/node.ts";

function link(parent: Node, child: Node) {
  parent.children.push(child);
  child.parent = parent;
}

Deno.test("Node touches parent", () => {
  const root = new Node([0, 0, 100, 100]);
  const node = new Node([0, 0, 100, 100]);

  link(root, node);

  const force = containmentForce(node);
  console.log(force);

  assertEquals(force, [-1, -1, -1, -1]);
});

Deno.test("Node inside parent", () => {
  const root = new Node([0, 0, 100, 100]);
  const node = new Node([10, 10, 90, 90]);

  link(root, node);

  const force = containmentForce(node);
  console.log(force);
  assertNotEquals(force, [-1, -1, -1, -1]);
});
