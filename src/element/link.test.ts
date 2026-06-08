import { assertEquals, assertInstanceOf } from "@std/assert";
import { Link } from "./link.ts";
import { Node } from "./node.ts";

Deno.test("Link constructor", () => {
  const source = new Node([10, 10, 20, 20]);
  const target = new Node([30, 30, 40, 40]);
  const link = new Link(source, target);
  assertInstanceOf(link, Link);
  assertEquals(link.source, source);
  assertEquals(link.target, target);
});

Deno.test("Link length", () => {
  const source = new Node([0, 0, 10, 10]);
  const target = new Node([20, 0, 30, 10]);
  const link = new Link(source, target);
  assertEquals(link.length, 20);
});

Deno.test("Link angle horizontal right", () => {
  const source = new Node([0, 0, 10, 10]);
  const target = new Node([20, 0, 30, 10]);
  const link = new Link(source, target);
  assertEquals(link.angle, 0);
});

Deno.test("Link angle vertical up", () => {
  const source = new Node([0, 0, 10, 10]);
  const target = new Node([0, 10, 10, 30]);
  const link = new Link(source, target);
  assertEquals(link.angle, Math.PI / 2);
});

Deno.test("Link angle diagonal 45°", () => {
  const source = new Node([0, 0, 10, 10]);
  const target = new Node([10, 10, 20, 20]);
  const link = new Link(source, target);
  assertEquals(link.angle, Math.PI / 4);
});
