import { Link, Node, Sides } from "../element/mod.ts";
import { Force } from "./types.ts";

/** Links pull towards being vertical or horizontal
 * @param links - Array of links to apply force on
 */
export const orthogonalForce = (links: Link[]): Force => {
  return (node: Node): Sides => {
    // Find links connected to this node
    const connectedLinks = links.filter(
      (l) => l.source === node || l.target === node,
    );
    if (connectedLinks.length === 0) return [0, 0, 0, 0] as Sides;

    const force: Sides = [0, 0, 0, 0];

    for (const link of connectedLinks) {
      const other = link.source === node ? link.target : link.source;
      const dx = other.x - node.x;
      const dy = other.y - node.y;

      // Push towards nearest axis
      // If horizontal difference is small, make vertical
      // If vertical difference is small, make horizontal
      const threshold = 5;
      const strength = 0.02;

      if (Math.abs(dx) < threshold && Math.abs(dx) < Math.abs(dy)) {
        // Pull nodes to align horizontally
        force[0] -= dx * strength;
        force[2] -= dx * strength;
      }
      if (Math.abs(dy) < threshold && Math.abs(dy) < Math.abs(dx)) {
        // Pull nodes to align vertically
        force[1] -= dy * strength;
        force[3] -= dy * strength;
      }
    }

    return force;
  };
};
