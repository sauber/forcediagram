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
      node.velocity.forEach((v) => {
        globalVelocity += Math.abs(v);
      });
    });
    return globalVelocity;
  }

  // Run simulation loop
  public async settle(
    maxIterations: number,
    velocityThreshold: number,
    callback?: CallBack,
  ): Promise<void> {
    for (let i = 0; i < maxIterations; i++) {
      // Apply forces
      this.applyForces();

      // Move nodes
      this.nodes.forEach((node) => node.move());

      // Calculate velocity
      const velocity = this.calculateVelocity();

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

  // Apply force calculations
  private applyForces(): void {
    for (const node of this.nodes) {
      for (const force of this.forces) {
        const f: Sides = force(node);
        node.applyForce(f);
      }
    }
  }
}
