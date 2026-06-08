import { assertEquals } from "@std/assert";
import { guardrailForce } from "./node.ts";
import { Node } from "../element/mod.ts";

Deno.test("Root node returns zero force", () => {
  const canvas = new Node([0, 0, 100, 100]);
  assertEquals(guardrailForce(canvas), [0, 0, 0, 0]);
});

Deno.test("Node with no parent returns zero force", () => {
  const node = new Node([10, 10, 30, 30]);
  assertEquals(guardrailForce(node), [0, 0, 0, 0]);
});

Deno.test("Child of non-canvas parent returns zero force", () => {
  const canvas = new Node([0, 0, 100, 100]);
  const parent = new Node([10, 10, 90, 90]);
  canvas.addNode(parent);
  const child = new Node([20, 20, 40, 40]);
  parent.addNode(child);
  assertEquals(guardrailForce(child), [0, 0, 0, 0]);
});

Deno.test("Canvas child well inside returns zero force", () => {
  const canvas = new Node([0, 0, 100, 100]);
  const child = new Node([20, 20, 40, 40]);
  canvas.addNode(child);
  assertEquals(guardrailForce(child), [0, 0, 0, 0]);
});

Deno.test("Canvas child near left edge gets repulsive force", () => {
  const canvas = new Node([0, 0, 100, 100]);
  const child = new Node([0.5, 20, 10, 40]);
  canvas.addNode(child);
  const force = guardrailForce(child);
  assertEquals(force[0] < 0, true);
  assertEquals(force[1] === 0, true);
  assertEquals(force[2] === 0, true);
  assertEquals(force[3] === 0, true);
});

Deno.test("Canvas child near bottom edge gets repulsive force", () => {
  const canvas = new Node([0, 0, 100, 100]);
  const child = new Node([20, 0.5, 40, 10]);
  canvas.addNode(child);
  const force = guardrailForce(child);
  assertEquals(force[0] === 0, true);
  assertEquals(force[1] < 0, true);
  assertEquals(force[2] === 0, true);
  assertEquals(force[3] === 0, true);
});

Deno.test("Canvas child near right edge gets repulsive force", () => {
  const canvas = new Node([0, 0, 100, 100]);
  const child = new Node([90, 20, 99.5, 40]);
  canvas.addNode(child);
  const force = guardrailForce(child);
  assertEquals(force[0] === 0, true);
  assertEquals(force[1] === 0, true);
  assertEquals(force[2] < 0, true);
  assertEquals(force[3] === 0, true);
});

Deno.test("Canvas child near top edge gets repulsive force", () => {
  const canvas = new Node([0, 0, 100, 100]);
  const child = new Node([20, 90, 40, 99.5]);
  canvas.addNode(child);
  const force = guardrailForce(child);
  assertEquals(force[0] === 0, true);
  assertEquals(force[1] === 0, true);
  assertEquals(force[2] === 0, true);
  assertEquals(force[3] < 0, true);
});

Deno.test("Canvas child past left edge gets strong repulsive force", () => {
  const canvas = new Node([0, 0, 100, 100]);
  const child = new Node([-5, 20, 10, 40]);
  canvas.addNode(child);
  const force = guardrailForce(child);
  assertEquals(force[0] < -1, true);
});

Deno.test("Canvas child past right edge gets strong repulsive force", () => {
  const canvas = new Node([0, 0, 100, 100]);
  const child = new Node([90, 20, 105, 40]);
  canvas.addNode(child);
  const force = guardrailForce(child);
  assertEquals(force[2] < -1, true);
});
