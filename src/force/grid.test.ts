import { assertAlmostEquals, assertEquals } from "@std/assert";
import { Node } from "../element/mod.ts";
import { gridForce } from "./grid.ts";

Deno.test("No parent yields zero force", () => {
  const g = gridForce(8);
  const node = new Node([0, 0, 100, 100]);
  assertEquals(g(node), [0, 0, 0, 0]);
});

Deno.test("Edge on grid line yields zero force", () => {
  const g = gridForce(8);
  const parent = new Node([0, 0, 300, 300]);
  const node = new Node([8, 8, 16, 16]);
  parent.addNode(node);
  const force = g(node);
  assertEquals(force[0], 0);
  assertEquals(force[1], 0);
  assertEquals(force[2], 0);
  assertEquals(force[3], 0);
});

Deno.test("Edge between grid lines pulls toward nearest grid line", () => {
  const g = gridForce(10);
  const parent = new Node([0, 0, 300, 300]);
  const node = new Node([3, 3, 13, 13]);
  parent.addNode(node);
  const force = g(node);
  // All sides pull toward nearest grid line => positive (outward) force
  // left=3 -> grid=0 -> offset=3, sin(0.6π) ≈ 0.95 > 0
  // right=13 -> grid=10 -> offset=-3, -sin(-0.6π) ≈ -0.95 < 0
  assertEquals(force[0] > 0, true);
  assertEquals(force[1] > 0, true);
  assertEquals(force[2] < 0, true);
  assertEquals(force[3] < 0, true);
});

Deno.test("Force is near zero at midpoint between grid lines", () => {
  const g = gridForce(10);
  const parent = new Node([0, 0, 300, 300]);
  const node = new Node([5, 5, 15, 15]);
  parent.addNode(node);
  const force = g(node);
  // left=5, Math.round(0.5)=1, nearest=10, offset=-5
  // left: sin(2π*(-5)/10) = sin(-π) ≈ 0
  // right: -sin(2π*(-5)/10) = -sin(-π) ≈ 0
  assertAlmostEquals(force[0], 0, 1e-10);
});
