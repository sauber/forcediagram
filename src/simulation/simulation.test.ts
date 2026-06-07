import { assertEquals, assertInstanceOf } from "@std/assert";
import { Link, Node, Sides, Text } from "../element/mod.ts";
import { CallBack, Simulation } from "./simulation.ts";
import { Force } from "../force/mod.ts";

const root: Node = new Node([0, 0, 20, 20]);
const node1: Node = root.addNode();
const node2: Node = root.addNode();
const _text: Text = node1.addText("Hello", 5, 1);
const links: Link[] = [new Link(node1, node2)];
const noForce: Force = () => [0, 0, 0, 0] as Sides;
const forces: Force[] = [noForce];

Deno.test("Simulation constructor", () => {
  const simulation = new Simulation(root, links, forces);
  assertInstanceOf(simulation, Simulation);
});

Deno.test("Simulation settle with callback", async () => {
  const simulation = new Simulation(node1, links, forces);

  let callbackCalled = false;
  const callback: CallBack = async (): Promise<void> => {
    callbackCalled = true;
    return await Promise.resolve();
  };

  await simulation.settle(10, 0.1, callback);

  assertEquals(callbackCalled, true);
});
