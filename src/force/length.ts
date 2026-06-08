import { Node, Sides } from "../element/mod.ts";
import { Force } from "./types.ts";
import { serpentine } from "./force.ts";

/** Links from same node approach same length */
export const lengthForce: Force = (node: Node): Sides => {
  const links = node.links;
  if (links.length < 2) return [0, 0, 0, 0] as Sides;

  const avgLength = links.reduce((sum, l) => sum + l.length, 0) /
    links.length;
  if (avgLength <= 0) return [0, 0, 0, 0] as Sides;

  const force: Sides = [0, 0, 0, 0];

  for (const link of links) {
    const other = link.source === node ? link.target : link.source;
    const dx = other.x - node.x;
    const dy = other.y - node.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist <= 0) continue;

    const diff = link.length - avgLength;
    const pull = serpentine(diff);

    const nx = dx / dist;
    const ny = dy / dist;

    force[0] -= nx * pull;
    force[1] -= ny * pull;
    force[2] -= nx * pull;
    force[3] -= ny * pull;
  }

  return force;
};
