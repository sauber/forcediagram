import { Node, Sides } from "../element/mod.ts";
import { Force } from "./types.ts";

/** Links pull towards being vertical or horizontal
 * Force depends on link angle from horizontal (0° = right, CCW), not on distance.
 * At 0° (horizontal) and 90° (vertical) force is 0.
 * At 22.5° force peaks toward horizontal; at 67.5° toward vertical.
 */
export const orthogonalForce: Force = (node: Node): Sides => {
  const force: Sides = [0, 0, 0, 0];
  for (const link of node.links) {
    const other = link.source === node ? link.target : link.source;
    const dx = other.x - node.x;
    const dy = other.y - node.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    if (length === 0) continue;

    const angle = Math.atan2(Math.abs(dy), Math.abs(dx));

    const f = Math.sin(4 * angle);

    if (angle < Math.PI / 4) {
      const dir = Math.sign(dy) || 1;
      force[1] -= f * dir;
      force[3] += f * dir;
    } else if (angle > Math.PI / 4) {
      const dir = Math.sign(dx) || 1;
      force[0] += f * dir;
      force[2] -= f * dir;
    }
  }

  return force;
};
