import { centerForce } from "./src/center.ts";
import { implodeForce } from "./src/implode.ts";
import { Node } from "./src/node.ts";

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
const canvas = new Node([0, 0, 100, 100]);
const node = canvas.addNode();
debug(0, node);

for (let i = 0; i < 200; i++) {
  centerForce(canvas);
  debug(i, node);
  implodeForce(canvas);
  debug(i, node);
  canvas.move();
  // debug(node);
}
