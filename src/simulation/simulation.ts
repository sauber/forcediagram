import { Node, Sides } from "../element/mod.ts";
import { Force } from "../force/mod.ts";

export type CallBack = (
  tree: Node,
  iteration: number,
  velocity: number,
) => Promise<void>;

/** Simulation Module
 * - Applies forces to nodes
 * - Moves nodes based on their velocity
 * - Calculates global velocity to determine when to stop
 * - Optionally calls a callback for rendering or logging
 */
export class Simulation {
  private readonly nodes: Node[];

  constructor(
    /** The root node of the tree */
    private readonly tree: Node,
    /** An array of force functions to apply */
    private readonly forces: Force[],
  ) {
    this.nodes = [tree, ...tree.children.flatMap((c) => [c, ...c.children])];
    // this.globalVelocity = 0;
  }

  // Calculate total velocity across all nodes
  private calculateVelocity(): number {
    let globalVelocity = 0;
    this.nodes.forEach((node) => {
      console.log(
        "Node at position:",
        node.position,
        "Velocity:",
        node.velocity,
      );
      node.velocity.forEach((v) => {
        globalVelocity += Math.abs(v);
      });
    });
    return globalVelocity;
  }

  // Apply force calculations
  private applyForces(): void {
    for (const node of this.nodes) {
      for (const force of this.forces) {
        const f: Sides = force(node);
        // Verify that force is in valid range [-2;2]
        // Force=0 is no force, Force=[-2;2] is normal force, Force>1 or <-1 is strong force
        // if (f.some((v) => v < -2 || v > 2)) {
        //   throw new Error(
        //     `Force ${force} out of bounds for node at (${node.x.toFixed(2)}, ${
        //       node.y.toFixed(2)
        //     }):`,
        //   );
        // }
        node.applyForce(f);
      }
    }
  }

  // Apply guardrails: keep nodes within parent bounds
  private applyGuardrails(): void {
    for (const node of this.nodes) {
      if (!node.parent) continue;
      const pp = node.parent.position;
      const vv = node.parent.velocity;
      const np = node.position;
      const nv = node.velocity;

      if (node.parent.parent) {
        // Non-canvas parent: expand parent to contain child
        if (np[0] < pp[0]) {
          pp[0] = np[0];
          vv[0] = nv[0];
        }
        if (np[1] < pp[1]) {
          pp[1] = np[1];
          vv[1] = nv[1];
        }
        if (np[2] > pp[2]) {
          pp[2] = np[2];
          vv[2] = nv[2];
        }
        if (np[3] > pp[3]) {
          pp[3] = np[3];
          vv[3] = nv[3];
        }
      } else {
        // Canvas parent: clamp child and reverse velocity
        if (np[0] < pp[0]) {
          np[0] = pp[0];
          nv[0] = -nv[0];
        }
        if (np[1] < pp[1]) {
          np[1] = pp[1];
          nv[1] = -nv[1];
        }
        if (np[2] > pp[2]) {
          np[2] = pp[2];
          nv[2] = -nv[2];
        }
        if (np[3] > pp[3]) {
          np[3] = pp[3];
          nv[3] = -nv[3];
        }
      }
    }
  }

  // Run simulation loop
  public async settle(
    maxIterations: number,
    velocityThreshold: number,
    callback?: CallBack,
  ): Promise<void> {
    // console.log(
    //   "Starting simulation with maxIterations:",
    //   maxIterations,
    //   "velocityThreshold:",
    //   velocityThreshold,
    // );
    for (let i = 0; i < maxIterations; i++) {
      // Apply forces
      this.applyForces();

      // Move nodes
      let velocity = 0;
      this.nodes.forEach((node) => (velocity += node.move()));

      // Apply guardrails
      this.applyGuardrails();

      // console.log("Iteration:", i, "Global velocity:", velocity);

      // Call callback if provided
      if (callback) {
        await callback(this.tree, i, velocity);
      }

      // Exit if velocity is below threshold
      if (velocity < velocityThreshold) {
        break;
      }
    }
  }
}
