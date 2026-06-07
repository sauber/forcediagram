import { Node } from "./node.ts";

/** Connection between two nodes */
export class Link {
  constructor(
    public readonly source: Node,
    public readonly target: Node,
  ) {}

  /** Euclidean distance between midpoints of connected nodes */
  get length(): number {
    const dx = this.source.x - this.target.x;
    const dy = this.source.y - this.target.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
