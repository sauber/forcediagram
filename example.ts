// deno-lint-ignore-file no-import-prefix
import { delay } from "jsr:@std/async@1.3.0/delay";
import { centerForce } from "./src/force/center.ts";
import { Node } from "./src/element/node.ts";
import { dashboard } from "./src/render/dashboard.ts";
import { Simulation } from "./src/simulation/simulation.ts";
import { embraceForce } from "./src/force/embrace.ts";
import { implodeForce } from "./src/force/implode.ts";
import { repulsiveForce } from "./src/force/repulse.ts";

// Tree of nodes
const width = 80, height = 24;
const canvas = new Node([0, 0, width, height]);
const node = canvas.addNode();
node.addText("Hello, World!", 13, 1);
const other = canvas.addNode();
other.addText("Spring Diagram", 15, 1);

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
const simulation = new Simulation(canvas, [], [
  centerForce,
  embraceForce,
  implodeForce,
  repulsiveForce,
]);
simulation.settle(500, 0.001, callback);
