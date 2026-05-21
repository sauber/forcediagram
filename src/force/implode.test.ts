import { assertLess } from "@std/assert";
import { implodeForce } from "./implode.ts";
import { Node } from "../element/node.ts";

/** A node wants to implode on itself to minimize size */
Deno.test.ignore("Implosion", () => {
  const node = new Node([0, 0, 100, 100]);

  // Apply centering forces
  implodeForce(node);

  // Sides should move inwards
  [0, 1, 2, 3].forEach((i) => assertLess(node.velocity[i], 0));
});
