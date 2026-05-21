import {
  assertAlmostEquals,
  assertEquals,
  assertGreater,
  assertLess,
} from "@std/assert";
import { gravity, repulsion, snap } from "./force.ts";

Deno.test("Gravity", () => {
  const y = gravity(1, 0);
  assertEquals(y, 1);
});

Deno.test("Repulsion", () => {
  const y = repulsion(0);
  assertEquals(y, -1);
});

Deno.test("Snap", () => {
  const ideal = 10;
  const equilibrium = snap(ideal, ideal);
  assertAlmostEquals(equilibrium, 0, 0.0001);

  const pull = snap(ideal + 1, ideal);
  assertGreater(pull, 0);

  const push = snap(ideal - 1, ideal);
  assertLess(push, 0);
});
