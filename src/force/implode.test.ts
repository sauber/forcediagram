import { assertLess } from "@std/assert";
import { implodeForce } from "./implode.ts";
import { Node, Sides } from "../element/mod.ts";

function link(parent: Node, child: Node) {
  parent.children.push(child);
  child.parent = parent;
}

/** A node wants to implode on itself to minimize size */
Deno.test("Implosion", () => {
  const root = new Node([0, 0, 100, 100]);
  const node = new Node([0, 0, 100, 100]);

  link(root, node);

  // Apply centering forces
  const force: Sides = implodeForce(node);
  // console.log({ force });

  // Sides should move inwards
  [0, 1, 2, 3].forEach((i) => assertLess(force[i], 0));
});
