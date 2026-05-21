import { centerForce } from "./src/force/center.ts";
import { implodeForce } from "./src/force/implode.ts";
import { Node } from "./src/element/node.ts";
import {
  Canvas,
  CharCanvas,
  drawFrame,
  drawLabel,
  drawLabelCentered,
} from "jsr:@sauber/ansi-draw@0.1.5";
import { delay } from "jsr:@std/async@1.3.0/delay";

// const terminal = new CharCanvas();

// List of all nodes in tree
function nodes(node: Node): Node[] {
  return [node, ...node.children.flatMap((c) => nodes(c))];
}

// Draw a single node onto canvas
function drawNode(terminal: Canvas, tree: Node): void {
  if ("label" in tree) {
    const label = tree.label as string;
    const x = tree.x;
    const y = tree.y;
    drawLabelCentered(terminal, x, y, label);
  } else {
    drawFrame(terminal, tree.left, tree.bottom, tree.width, tree.height);
  }
}

let height = 0;
function drawTree(
  tree: Node,
  iteration: number = 0,
  velocity: number = 0,
): void {
  const allNodes = nodes(tree);
  const terminal = new CharCanvas();

  // Draw node info
  allNodes.forEach((n, i) =>
    drawLabel(terminal, 1, allNodes.length - i, nodeInfo(n))
  );

  // Draw shapes
  allNodes.forEach((n) => drawNode(terminal, n));

  // drawNode(terminal, tree);
  drawLabel(terminal, 1, 0, `Iteration: ${iteration}`);
  drawLabel(
    terminal,
    20,
    0,
    `Velocity: ${parseFloat(velocity.toPrecision(3))}`,
  );
  const output = terminal.toString();
  const up: string = height > 0 ? "\u001b[" + height + "A" : "";
  const reset: string = "\u001b[0J";
  console.log(up + reset + output);
  height = output.split("\n").length;
  // console.log({ height, up, reset });
}

// Display array with few digits
const nums = (values: number[]): number[] =>
  values.map((n) => parseFloat(n.toPrecision(3)));

const nodeInfo = (node: Node): string =>
  `pos: ${nums(node.position)} xy: ${nums([node.x, node.y])} m: ${
    nums([
      node.mass,
    ])
  } v: ${nums(node.velocity)}${"label" in node ? " label: " + node.label : ""}`;

// const debug = (i: number, node: Node): void =>
//   console.log(
//     i,
//     "p",
//     nums(node.position),
//     "xy",
//     nums([node.x, node.y]),
//     "m",
//     nums([node.mass])[0],
//     "v",
//     nums(node.velocity),
//   );

// Example of box seeking center of canvas
const canvas = new Node([0, 0, 80, 24]);
const node = canvas.addNode();
node.addText("Hello, World!", 13, 1);
// console.log(canvas);
// Deno.exit(1);

// debug(0, node);
// debug(0, text);
// console.log();
drawTree(canvas);
// Deno.exit(1);

for (let i = 0; i < 300; i++) {
  centerForce(canvas);
  // debug(i, node);
  implodeForce(canvas);
  // debug(i, node);
  const v: number = canvas.move();
  // debug(node);
  drawTree(canvas, i, v);
  await delay(100);
}
// console.log(canvas);
