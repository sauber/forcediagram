import {
  Canvas,
  CharCanvas,
  drawFrame,
  drawLabel,
  drawLabelCentered,
  drawLine,
} from "@sauber/ansi-draw";
import { Link, Node } from "../element/mod.ts";

// Display array with few digits
const nums = (values: number[]): number[] =>
  values.map((n) => parseFloat(n.toPrecision(3)));

// One-liner info for a node
const nodeInfo = (node: Node): string =>
  `pos: ${nums(node.position)} xy: ${nums([node.x, node.y])} m: ${
    nums([node.mass])
  } v: ${nums(node.velocity)}${"label" in node ? " label: " + node.label : ""}`;

// Draw a node frame or label onto canvas
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

/** Dashboard Rendering
 * The dashboard displays
 * - the current iteration number
 * - the current velocity of the simulation
 * - a visual representation of the nodes and their connections
 * - the properties of each node (position, mass, velocity)
 *
 * @returns A callback function that can be passed to the Simulation.settle method.
 */
export const dashboard = (
  tree: Node,
  iteration: number,
  velocity: number,
): string => {
  const canvas = new CharCanvas();
  const nodes = [tree, ...tree.children.flatMap((c) => [c, ...c.children])];

  // Draw links between nodes
  const drawnLinks = new Set<Link>();
  nodes.forEach((n) =>
    n.links.forEach((link) => {
      if (!drawnLinks.has(link)) {
        drawnLinks.add(link);
        drawLine(canvas, link.source.x, link.source.y, link.target.x, link.target.y);
      }
    })
  );

  // Draw node info and shapes
  nodes.forEach((n, i) => drawLabel(canvas, 1, nodes.length - i, nodeInfo(n)));
  nodes.forEach((n) => drawNode(canvas, n));

  // Draw iteration and velocity info
  drawLabel(canvas, 1, 0, `Iteration: ${iteration}`);
  drawLabel(canvas, 20, 0, `Velocity: ${parseFloat(velocity.toPrecision(3))}`);

  return canvas.toString();
};
