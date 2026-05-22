import { Node, Sides } from "../element/node.ts";
import { Force } from "../force/types.ts";

export type CallBack = (
  tree: Node,
  iteration: number,
  velocity: number,
) => Promise<void>;

export type Link = { source: Node; target: Node };

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
    /** An array of links between nodes (not used in current forces) */
    private readonly links: Link[],
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
        // console.debug(`Applying force to node at (${node.x}, ${node.y}):`, f);
        // Verify that force is in valid range [-1;1]
        if (f.some((v) => v < -1 || v > 1)) {
          throw new Error(
            `Force out of bounds for node at (${node.x.toFixed(2)}, ${
              node.y.toFixed(2)
            }):`,
            f,
          );
        }
        node.applyForce(f);
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

      // console.log("Iteration:", i, "Global velocity:", velocity);

      // Calculate velocity
      // const velocity = this.calculateVelocity();

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
