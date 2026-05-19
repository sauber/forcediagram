import { centerForce } from "./src/center.ts";
import { implodeForce } from "./src/implode.ts";
import { Node } from "./src/node.ts";
import {
  Canvas,
  CharCanvas,
  drawFrame,
  drawLabelCentered,
} from "jsr:@sauber/ansi-draw";
import { delay } from "jsr:@std/async/delay";

// const terminal = new CharCanvas();

function drawNode(terminal: Canvas, tree: Node): void {
  if ("label" in tree) {
    const label = tree.label as string;
    const x = tree.x;
    const y = tree.y;
    drawLabelCentered(terminal, x, y, label);
  } else {
    if (tree.width >= 2 && tree.height >= 2) {
      drawFrame(terminal, tree.left, tree.bottom, tree.width, tree.height);
    }
  }

  tree.children.forEach((c) => drawNode(terminal, c));
}

let height = 0;
function drawTree(tree: Node): void {
  const terminal = new CharCanvas();
  drawNode(terminal, tree);
  const output = terminal.toString();
  const up: string = "\u001b[" + height + "A";
  const reset: string = "\u001b[0J";
  console.log(up + reset + output);
  height = output.split("\n").length;
  // console.log("Height: " + height);
}

// Display array with few digits
const nums = (values: number[]): number[] =>
  values.map((n) => parseFloat(n.toPrecision(3)));

const debug = (i: number, node: Node): void =>
  console.log(
    i,
    "p",
    nums(node.position),
    "m",
    nums([node.mass])[0],
    "v",
    nums(node.velocity),
  );

// Example of box seeking center of canvas
const canvas = new Node([1, 1, 80, 24]);
const node = canvas.addNode();
// const text = node.addText("Hello, World!");
debug(0, node);

for (let i = 0; i < 20; i++) {
  centerForce(canvas);
  // debug(i, node);
  implodeForce(canvas);
  // debug(i, node);
  canvas.move();
  // debug(node);
  drawTree(canvas);
  await delay(100);
}
console.log(node);
