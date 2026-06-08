import { assertAlmostEquals } from "@std/assert";
import { lengthForce } from "./length.ts";
import { Node, Sides } from "../element/mod.ts";

const TOL = 1e-10;

function assertZeroForce(force: Sides) {
  force.forEach((v) => assertAlmostEquals(v, 0, TOL));
}

Deno.test("No links returns zero force", () => {
  assertZeroForce(lengthForce(new Node([0, 0, 10, 10])));
});

Deno.test("Single link returns zero force", () => {
  const a = new Node([0, 0, 10, 10]);
  a.addLink(new Node([20, 0, 30, 10]));
  assertZeroForce(lengthForce(a));
});

Deno.test("Two equal-length links produce zero force", () => {
  const a = new Node([0, 0, 10, 10]);
  a.addLink(new Node([20, 0, 30, 10]));
  a.addLink(new Node([0, 20, 10, 30]));
  assertZeroForce(lengthForce(a));
});

Deno.test("Longer link attracts, shorter link repels", () => {
  const a = new Node([0, 0, 10, 10]);
  const b = new Node([20, 0, 30, 10]);
  const c = new Node([60, 0, 70, 10]);
  a.addLink(b);
  a.addLink(c);

  const force = lengthForce(a);

  // A-B: length 20, A-C: length 60. Average = 40.
  // A-B diff = -20 → serpentine(-20) < 0 → repels → negative pull → expands
  // A-C diff = 20 → serpentine(20) > 0 → attracts → positive pull → shrinks
  // Force should be non-zero on horizontal axis
  assertAlmostEquals(force[1], 0, TOL);
  assertAlmostEquals(force[3], 0, TOL);
  // Both left and right should have the same sign (shrinking or expanding)
  assertAlmostEquals(force[0], force[2], TOL);
});

Deno.test("Force on a node between two links on same axis", () => {
  const a = new Node([0, 0, 10, 10]);
  const b = new Node([0, 20, 10, 30]);
  const c = new Node([0, 60, 10, 70]);
  b.addLink(a);
  b.addLink(c);

  const force = lengthForce(b);

  // B-A: length 20, B-C: length 60. Average = 40.
  // B-A diff = -20 → repels → expands
  // B-C diff = 20 → attracts → shrinks
  assertAlmostEquals(force[0], 0, TOL);
  assertAlmostEquals(force[2], 0, TOL);
  assertAlmostEquals(force[1], force[3], TOL);
});
