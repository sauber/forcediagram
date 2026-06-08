import { Link, Node, Sides } from "../element/mod.ts";
import { Force } from "./types.ts";

function segmentsCross(
  ax: number, ay: number,
  bx: number, by: number,
  cx: number, cy: number,
  dx: number, dy: number,
): boolean {
  const orient = (px: number, py: number, qx: number, qy: number, rx: number, ry: number) =>
    (qy - py) * (rx - qx) - (qx - px) * (ry - qy);
  const o1 = orient(ax, ay, bx, by, cx, cy);
  const o2 = orient(ax, ay, bx, by, dx, dy);
  const o3 = orient(cx, cy, dx, dy, ax, ay);
  const o4 = orient(cx, cy, dx, dy, bx, by);
  return (o1 > 0 && o2 < 0 || o1 < 0 && o2 > 0) && (o3 > 0 && o4 < 0 || o3 < 0 && o4 > 0);
}

function collectLinks(root: Node): Link[] {
  const seen = new Set<Link>();
  const walk = (node: Node) => {
    for (const link of node.links) seen.add(link);
    for (const child of node.children) walk(child);
  };
  walk(root);
  return [...seen];
}

export const crossForce = (root: Node): Force => {
  const allLinks = collectLinks(root);

  return (node: Node): Sides => {
    const force: Sides = [0, 0, 0, 0];
    if (node.links.length === 0) return force;

    for (const linkA of node.links) {
      const ax = linkA.source.x, ay = linkA.source.y;
      const bx = linkA.target.x, by = linkA.target.y;
      const adx = bx - ax, ady = by - ay;
      const alen = Math.sqrt(adx * adx + ady * ady) || 1;
      const pdx = -ady / alen;
      const pdy = adx / alen;

      for (const linkB of allLinks) {
        if (linkA === linkB) continue;
        if (linkA.source === linkB.source || linkA.source === linkB.target ||
            linkA.target === linkB.source || linkA.target === linkB.target) continue;

        const cx = linkB.source.x, cy = linkB.source.y;
        const dx = linkB.target.x, dy = linkB.target.y;

        if (segmentsCross(ax, ay, bx, by, cx, cy, dx, dy)) {
          if (node === linkA.source || node === linkA.target) {
            force[0] += 0.05 * pdx;
            force[1] += 0.05 * pdy;
            force[2] += -0.05 * pdx;
            force[3] += -0.05 * pdy;
          }
        }
      }
    }

    return force;
  };
};
