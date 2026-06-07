import { Link, Node, Sides } from "../element/mod.ts";
import { Force } from "./types.ts";

/** Links pull towards having same length
 * @param links - Array of links to apply force on
 */
export const lengthForce = (links: Link[]): Force => {
  return (node: Node): Sides => {
    const connectedLinks = links.filter(
      (l) => l.source === node || l.target === node,
    );
    if (connectedLinks.length === 0 || links.length < 2) {
      return [0, 0, 0, 0] as Sides;
    }

    // Calculate average length of all links
    const avgLength = links.reduce((sum, l) => sum + l.length, 0) /
      links.length;
    if (avgLength <= 0) return [0, 0, 0, 0] as Sides;

    const force: Sides = [0, 0, 0, 0];

    for (const link of connectedLinks) {
      const diff = link.length - avgLength;
      const other = link.source === node ? link.target : link.source;
      const dx = other.x - node.x;
      const dy = other.y - node.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= 0) continue;

      const strength = 0.01;
      const pull = diff * strength;

      // Pull nodes towards/away from each other
      const nx = dx / dist;
      const ny = dy / dist;

      force[0] -= nx * pull;
      force[1] -= ny * pull;
      force[2] -= nx * pull;
      force[3] -= ny * pull;
    }

    return force;
  };
};
