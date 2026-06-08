import { assertAlmostEquals } from "@std/assert";
import { orthogonalForce } from "./orthogonal.ts";
import { Node, Sides } from "../element/mod.ts";

function assertZeroForce(force: Sides, tol = 1e-10) {
  force.forEach((v) => assertAlmostEquals(v, 0, tol));
}

Deno.test("No links returns zero force", () => {
  const node = new Node([0, 0, 10, 10]);
  assertZeroForce(orthogonalForce(node));
});

Deno.test("Horizontal link (0° from horizontal) returns zero force", () => {
  const nodeA = new Node([0, 0, 10, 10]);
  const nodeB = new Node([20, 0, 30, 10]);
  nodeA.addLink(nodeB);
  assertZeroForce(orthogonalForce(nodeA));
});

Deno.test("Vertical link (90° from horizontal) returns zero force", () => {
  const nodeA = new Node([0, 0, 10, 10]);
  const nodeB = new Node([0, 20, 10, 30]);
  nodeA.addLink(nodeB);
  assertZeroForce(orthogonalForce(nodeA));
});

Deno.test("45° diagonal is equilibrium and returns zero force", () => {
  const nodeA = new Node([0, 0, 10, 10]);
  const nodeB = new Node([10, 10, 20, 20]);
  nodeA.addLink(nodeB);
  assertZeroForce(orthogonalForce(nodeA));
});

Deno.test("30° angle pushes vertical toward horizontal", () => {
  const nodeA = new Node([0, 0, 10, 10]);
  const dist = 10;
  const dx = dist * Math.cos(Math.PI / 6);
  const dy = dist * Math.sin(Math.PI / 6);
  const cx = 5, cy = 5;
  const nodeB = new Node([cx + dx - 5, cy + dy - 5, cx + dx + 5, cy + dy + 5]);
  nodeA.addLink(nodeB);

  const force = orthogonalForce(nodeA);
  const expected = Math.sin(4 * Math.PI / 6);

  assertAlmostEquals(force[0], 0, 1e-10);
  assertAlmostEquals(force[2], 0, 1e-10);
  assertAlmostEquals(force[1], -expected, 1e-10);
  assertAlmostEquals(force[3], expected, 1e-10);
});

Deno.test("60° angle pushes horizontal toward vertical", () => {
  const nodeA = new Node([0, 0, 10, 10]);
  const dist = 10;
  const dx = dist * Math.cos(Math.PI / 3);
  const dy = dist * Math.sin(Math.PI / 3);
  const cx = 5, cy = 5;
  const nodeB = new Node([cx + dx - 5, cy + dy - 5, cx + dx + 5, cy + dy + 5]);
  nodeA.addLink(nodeB);

  const force = orthogonalForce(nodeA);
  const expected = Math.sin(4 * Math.PI / 3);

  assertAlmostEquals(force[1], 0, 1e-10);
  assertAlmostEquals(force[3], 0, 1e-10);
  assertAlmostEquals(force[0], expected, 1e-10);
  assertAlmostEquals(force[2], -expected, 1e-10);
});

Deno.test("Force direction flips with opposite vertical offset", () => {
  const nodeA = new Node([0, 0, 10, 10]);
  const dist = 10;
  const dx = dist * Math.cos(Math.PI / 6);
  const dy = -dist * Math.sin(Math.PI / 6);
  const cx = 5, cy = 5;
  const nodeB = new Node([cx + dx - 5, cy + dy - 5, cx + dx + 5, cy + dy + 5]);
  nodeA.addLink(nodeB);

  const force = orthogonalForce(nodeA);
  const expected = Math.sin(4 * Math.PI / 6);

  assertAlmostEquals(force[0], 0, 1e-10);
  assertAlmostEquals(force[2], 0, 1e-10);
  assertAlmostEquals(force[1], expected, 1e-10);
  assertAlmostEquals(force[3], -expected, 1e-10);
});

Deno.test("Nodes at same position produce zero force", () => {
  const nodeA = new Node([0, 0, 10, 10]);
  const nodeB = new Node([0, 0, 10, 10]);
  nodeA.addLink(nodeB);
  assertZeroForce(orthogonalForce(nodeA));
});
