import { assertEquals } from "@std/assert";
import { Node, Text } from "../element/mod.ts";
import { sizeForce } from "./size.ts";

Deno.test("No parent returns zero force", () => {
  const node = new Node([0, 0, 100, 100]);
  assertEquals(sizeForce(node), [0, 0, 0, 0]);
});

Deno.test("No siblings returns zero force", () => {
  const parent = new Node([0, 0, 200, 200]);
  const node = new Node([0, 0, 100, 100]);
  parent.addNode(node);
  assertEquals(sizeForce(node), [0, 0, 0, 0]);
});

Deno.test("Equal mass siblings produce zero force", () => {
  const parent = new Node([0, 0, 200, 200]);
  const a = new Node([0, 0, 100, 100]);
  const b = new Node([0, 0, 100, 100]);
  parent.addNode(a);
  parent.addNode(b);
  assertEquals(sizeForce(a), [0, 0, 0, 0]);
  assertEquals(sizeForce(b), [0, 0, 0, 0]);
});

Deno.test("Node twice as massive as sibling shrinks all sides", () => {
  const parent = new Node([0, 0, 200, 200]);
  const large = new Node([0, 0, 10, 20]); // mass = 200
  const small = new Node([0, 0, 10, 10]); // mass = 100
  parent.addNode(large);
  parent.addNode(small);

  assertEquals(sizeForce(large), [-0.5, -0.5, -0.5, -0.5]);
});

Deno.test("Node half as massive as sibling grows all sides", () => {
  const parent = new Node([0, 0, 200, 200]);
  const small = new Node([0, 0, 10, 10]); // mass = 100
  const large = new Node([0, 0, 10, 20]); // mass = 200
  parent.addNode(small);
  parent.addNode(large);

  assertEquals(sizeForce(small), [0.4, 0.4, 0.4, 0.4]);
});

Deno.test("Force magnitude never exceeds 0.5", () => {
  const parent = new Node([0, 0, 200, 200]);
  const huge = new Node([0, 0, 1000, 1000]); // mass = 1000000
  const tiny = new Node([0, 0, 1, 1]); // mass = 1
  parent.addNode(huge);
  parent.addNode(tiny);

  const force = sizeForce(huge);
  [0, 1, 2, 3].forEach((i) => assertEquals(Math.abs(force[i]) <= 0.5, true));
});

Deno.test("Text node with siblings applies size force", () => {
  const parent = new Node([0, 0, 200, 200]);
  const text = new Text("hi", 50, 50, 10, 4); // mass = 40
  const large = new Node([0, 0, 10, 10]); // mass = 100
  parent.addNode(text);
  parent.addNode(large);

  // siblings = [large], avgMass = 100
  // massRatio = (40 - 100)/100 = -0.6, serpentine(0.6) = 0.882..., f ≈ 0.441
  const force = sizeForce(text);
  assertEquals(force[0] > 0, true);
  assertEquals(force[1] > 0, true);
  assertEquals(force[2] > 0, true);
  assertEquals(force[3] > 0, true);
});
