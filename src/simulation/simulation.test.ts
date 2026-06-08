import { assertEquals, assertGreater, assertInstanceOf } from "@std/assert";
import { Node, Sides } from "../element/mod.ts";
import { CallBack, Simulation } from "./simulation.ts";
import { Force } from "../force/mod.ts";

const root: Node = new Node([0, 0, 20, 20]);
const node1: Node = root.addNode();
const noForce: Force = () => [0, 0, 0, 0] as Sides;
const forces: Force[] = [noForce];

Deno.test("Simulation constructor", () => {
  const simulation = new Simulation(root, forces);
  assertInstanceOf(simulation, Simulation);
});

Deno.test("Simulation settle with callback", async () => {
  const simulation = new Simulation(node1, forces);

  let callbackCalled = false;
  const callback: CallBack = async (): Promise<void> => {
    callbackCalled = true;
    return await Promise.resolve();
  };

  await simulation.settle(10, 0.1, callback);

  assertEquals(callbackCalled, true);
});

Deno.test("Guardrail clamps canvas child inside canvas", async () => {
  const canvas = new Node([0, 0, 50, 50]);
  const child = new Node([-10, -10, 10, 10]);
  canvas.addNode(child);
  const sim = new Simulation(canvas, forces);
  await sim.settle(1, 0);
  assertGreater(child.left, canvas.left - 1);
  assertGreater(child.bottom, canvas.bottom - 1);
});

Deno.test("Guardrail expands non-canvas parent to contain child", async () => {
  const canvas = new Node([0, 0, 50, 50]);
  const parent = new Node([10, 10, 30, 30]);
  canvas.addNode(parent);
  const child = new Node([5, 5, 20, 20]);
  parent.addNode(child);
  const sim = new Simulation(canvas, forces);
  await sim.settle(1, 0);
  assertEquals(parent.left, child.left);
  assertEquals(parent.bottom, child.bottom);
});
