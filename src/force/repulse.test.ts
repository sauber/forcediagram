import { assertEquals } from "@std/assert";
import { overlapRatio, repulsiveForce } from "./repulse.ts";
import { Node, Sides } from "../element/node.ts";

// Test cases for overlapping nodes
const overlapTestCases: [string, Sides, Sides, number][] = [
  ["Exact", [0, 0, 100, 100], [0, 0, 100, 100], 1],
  ["Corner", [0, 0, 100, 100], [50, 50, 150, 150], 0.25],
  ["None", [0, 0, 100, 100], [150, 150, 250, 250], 0],
  ["Partial", [0, 0, 100, 100], [50, -50, 150, 150], 0.5],
  ["Touch", [0, 0, 100, 100], [100, 0, 200, 100], 0],
  ["Large", [0, 0, 100, 100], [-50, -50, 150, 150], 1],
];

Deno.test("Overlap", () => {
  overlapTestCases.forEach(([name, a, b, expected]) => {
    const r = overlapRatio(a, b);
    console.log(
      `${name}: overlapRatio = ${r.toFixed(2)}, expected = ${expected}`,
    );
    assertEquals(r, expected);
  });
});

// Test cases for repulsive forces between nodes
// deno-fmt-ignore
// Format: [description, nodeA sides, nodeB sides, expected min force, expected max force]
const repulsiveTestCases: [string, Sides, Sides, Sides, Sides][] = [
  // Overlapping nodes should have strong repulsion to the shortest way out
  ["Exact overlap",  [0, 0, 100, 100], [0, 0, 100, 100],  [-2, 0, 0, 0], [-1, 0, 0, 0]],
  ["Overlap left",   [0, 0, 100, 100], [-50, 0, 50, 100], [-2, 0, 0, 0], [-1, 0, 0, 0]],
  ["Overlap bottom", [0, 0, 100, 100], [0, -50, 100, 50], [0, -2, 0, 0], [0, -1, 0, 0]],
  ["Overlap right",  [0, 0, 100, 100], [50, 0, 150, 100], [0, 0, -2, 0], [0, 0, -1, 0]],
  ["Overlap top",    [0, 0, 100, 100], [0, 50, 100, 150], [0, 0, 0, -2], [0, 0, 0, -1]],

  // Sides are touching should have repulsion of -1
  ["Left touching", [0, 0, 100, 100], [-100, 0, 0, 100], [-1, 0, 0, 0], [-1, 0, 0, 0]],
  ["Bottom touching", [0, 0, 100, 100], [0, -100, 100, 0], [0, -1, 0, 0], [0, -1, 0, 0]],
  ["Right touching", [0, 0, 100, 100], [100, 0, 200, 100], [0, 0, -1, 0], [0, 0, -1, 0]],
  ["Top touching", [0, 0, 100, 100], [0, 100, 100, 200], [0, 0, 0, -1], [0, 0, 0, -1]],

  // Aligned sides should have repulsion to the aligned side, magnitude depends on distance and overlap
  ["Aligned left", [0, 0, 100, 100], [-150, 0, -50, 100], [-1, 0, 0, 0], [0, 0, 0, 0]],
  ["Aligned bottom", [0, 0, 100, 100], [0, -150, 100, -50], [0, -1, 0, 0], [0, 0, 0, 0]],
  ["Aligned right", [0, 0, 100, 100], [150, 0, 250, 100], [0, 0, -1, 0], [0, 0, 0, 0]],
  ["Aligned top", [0, 0, 100, 100], [0, 150, 100, 250], [0, 0, 0, -1], [0, 0, 0, 0]],

  // Not aligned nodes should have repulsion to the closest corner, magnitude depends on angle and distance
  ["Bottom Left Corner", [0, 0, 100, 100], [-150, -150, -50, -50], [-1, -1, 0, 0], [0, 0, 0, 0]],
  ["Bottom Right Corner", [0, 0, 100, 100], [150, -150, 250, -50], [0, -1, -1, 0], [0, 0, 0, 0]],
  ["Top Right Corner", [0, 0, 100, 100], [150, 150, 250, 250], [0, 0, -1, -1], [0, 0, 0, 0]],
  ["Top Left Corner", [0, 0, 100, 100], [-150, 150, -50, 250], [-1, 0, 0, -1], [0, 0, 0, 0]],
];

Deno.test("Repulsive Force", () => {
  repulsiveTestCases.forEach(([name, a, b, min, max]) => {
    // Create object tree
    const nodeA = new Node(a);
    const nodeB = new Node(b);
    const parent = new Node([-300, -300, 300, 300]);
    parent.children.push(nodeA);
    parent.children.push(nodeB);
    nodeA.parent = parent;
    nodeB.parent = parent;

    const force = repulsiveForce(nodeA);
    console.log(
      `${name}: force = ${
        force.map((f) => f.toPrecision(2))
      }, expected min = ${min}, expected max = ${max}`,
    );
    assertEquals(
      force.map((f, i) => (
        // Exact match if min == max, otherwise check if within range
        min[i] == max[i] && f == min[i]
          ? "ok"
          : (f <= min[i] ? "min" : (f >= max[i] ? "max" : "ok"))
      )),
      ["ok", "ok", "ok", "ok"],
    );
  });
});

// Assuming 0° is straight up, 90° is straight right, 180° is straight down, and 270° is straight left
//
// When direction from A's top right corner to B's bottom left corner is 45°,
// A should be have respulsive force to top and right sides,
// and the forces to both sides are equal in magnitude.
//
// When corner to corner direction is ]0;45[°,
// A should have stronger repulsion to the top side than the right side.
//
// When corner to corner direction is ]45;90[°,
// A should have stronger repulsion to the right side than the top side.
//
// Similar logic applies for other corners and angles.
// The force magnitude should depend on the angle the nodes.
Deno.test("Repulsive Force Angle", () => {
  const nodeA = new Node([0, 0, 100, 100]);
  const parent = new Node([-300, -300, 300, 300]);
  parent.children.push(nodeA);
  nodeA.parent = parent;
  // deno-fmt-ignore

  const angles = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];
  angles.forEach((angle) => {
    const radians = (angle * Math.PI) / 180;
    const nodeB = new Node([
      Math.cos(radians) * 150 - 50,
      Math.sin(radians) * 150 - 50,
      Math.cos(radians) * 150 + 50,
      Math.sin(radians) * 150 + 50,
    ]);
    parent.children.push(nodeB);
    nodeB.parent = parent;

    const force = repulsiveForce(nodeA);
    // console.log(
    //   `Angle ${angle}°: force = ${force.map((f) => f.toPrecision(2))}`,
    // );

    // TODO: Assert force direction and magnitude based on angle

    parent.children.pop(); // Clean up for next iteration
  });
});
