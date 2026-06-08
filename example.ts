// deno-lint-ignore-file no-import-prefix
import { delay } from "jsr:@std/async@1.3.0/delay";
import { Node } from "./src/element/mod.ts";
import {
  alignForce,
  centerForce,
  containmentForce,
  embraceForce,
  gridForce,
  implodeForce,
  lengthForce,
  orthogonalForce,
  repulsiveForce,
  sizeForce,
} from "./src/force/mod.ts";
import { dashboard } from "./src/render/mod.ts";
import { Simulation } from "./src/simulation/mod.ts";

// Tree of nodes
const width = 80, height = 24;
const canvas = new Node([0, 0, width, height]);
const node = canvas.addNode();
node.addText("Hello, World!", 13, 1);
const other = canvas.addNode();
other.addText("Force Diagram", 15, 1);
// const links = [new Link(node, other)];
node.addLink(other);

// Cluster of Nodes
const start = canvas.addNode();
start.addText("Start", 5, 1);
const end = canvas.addNode();
end.addText("End", 3, 1);
const main = canvas.addNode();
main.addText("Main", 4, 1);
// const a = main.addNode();
// a.addText("A", 1, 1);
// const b = main.addNode();
// b.addText("B", 1, 1);
// start.addLink(main);
// a.addLink(b);
// b.addLink(end);

// Call back function to render dashboard after each iteration
let output_lines = 0;
const callback = async (
  tree: Node,
  iteration: number,
  velocity: number,
): Promise<void> => {
  const output = dashboard(tree, iteration, velocity);
  const up: string = output_lines > 0 ? "\u001b[" + output_lines + "A" : "";
  const reset: string = "\u001b[0J";
  console.log(up + reset + output);
  output_lines = output.split("\n").length;
  await delay(10);
};

// Display initial state
callback(canvas, 0, 0);

// Run simulation
const simulation = new Simulation(canvas, [
  alignForce,
  centerForce,
  containmentForce,
  embraceForce,
  gridForce(4),
  implodeForce,
  lengthForce,
  orthogonalForce,
  repulsiveForce,
  sizeForce,
]);
simulation.settle(500, 0.001, callback);
