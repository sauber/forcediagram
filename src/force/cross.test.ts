import { assertAlmostEquals, assertNotEquals } from "@std/assert";
import { crossForce } from "./cross.ts";
import { Node, Sides } from "../element/mod.ts";

function isZero(force: Sides): boolean {
  return force.every((v) => Math.abs(v) === 0);
}

function assertZeroForce(force: Sides) {
  force.forEach((v) => assertAlmostEquals(v, 0, 1e-10));
}

Deno.test("No links returns zero force", () => {
  const root = new Node([0, 0, 100, 100]);
  const node = new Node([10, 10, 30, 30]);
  root.addNode(node);
  const f = crossForce(root);
  assertZeroForce(f(node));
});

Deno.test("Single link returns zero force", () => {
  const root = new Node([0, 0, 100, 100]);
  const a = new Node([10, 10, 30, 30]);
  const b = new Node([40, 40, 60, 60]);
  root.addNode(a);
  root.addNode(b);
  a.addLink(b);
  const f = crossForce(root);
  assertZeroForce(f(a));
});

Deno.test("Two links sharing a node do not cross", () => {
  const root = new Node([0, 0, 100, 100]);
  const a = new Node([10, 10, 30, 30]);
  const b = new Node([40, 10, 60, 30]);
  const c = new Node([70, 10, 90, 30]);
  root.addNode(a);
  root.addNode(b);
  root.addNode(c);
  a.addLink(b);
  a.addLink(c);
  const f = crossForce(root);
  assertZeroForce(f(a));
});

Deno.test("Two crossing links produce non-zero force", () => {
  const root = new Node([0, 0, 100, 100]);
  const a = new Node([10, 10, 30, 30]);
  const b = new Node([70, 70, 90, 90]);
  const c = new Node([10, 70, 30, 90]);
  const d = new Node([70, 10, 90, 30]);
  root.addNode(a);
  root.addNode(b);
  root.addNode(c);
  root.addNode(d);
  a.addLink(b);
  c.addLink(d);
  const f = crossForce(root);
  const forceA = f(a);
  const forceC = f(c);
  const allZero = isZero(forceA) && isZero(forceC);
  assertNotEquals(allZero, true);
});

Deno.test("Non-crossing links produce zero force", () => {
  const root = new Node([0, 0, 100, 100]);
  const a = new Node([10, 10, 30, 30]);
  const b = new Node([40, 10, 60, 30]);
  const c = new Node([10, 50, 30, 70]);
  const d = new Node([40, 50, 60, 70]);
  root.addNode(a);
  root.addNode(b);
  root.addNode(c);
  root.addNode(d);
  a.addLink(b);
  c.addLink(d);
  const f = crossForce(root);
  assertZeroForce(f(a));
  assertZeroForce(f(c));
});
