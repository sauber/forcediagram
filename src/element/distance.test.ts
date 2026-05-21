import { assertEquals } from "@std/assert";
import { Sides } from "./node.ts";
import { nodeDistance } from "./distance.ts";

Deno.test("Left distance", () => {
  const a: Sides = [50, 50, 60, 60];
  const b: Sides = [30, 50, 40, 60];
  const d = nodeDistance(a, b);
  assertEquals(d[0], 10);
});

Deno.test("Bottom distance", () => {
  const a: Sides = [50, 50, 60, 60];
  const b: Sides = [50, 30, 60, 40];
  const d = nodeDistance(a, b);
  assertEquals(d[1], 10);
});

Deno.test("Right distance", () => {
  const a: Sides = [50, 50, 60, 60];
  const b: Sides = [70, 50, 80, 60];
  const d = nodeDistance(a, b);
  assertEquals(d[2], 10);
});

Deno.test("Top distance", () => {
  const a: Sides = [50, 50, 60, 60];
  const b: Sides = [50, 70, 60, 80];
  const d = nodeDistance(a, b);
  assertEquals(d[3], 10);
});
