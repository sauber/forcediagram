import { Link } from "./mod.ts";

// Vector of Left, Bottom, Right and Top
export type Sides = [number, number, number, number];

/** Rectangle node */
export class Node {
  public parent: Node | undefined;
  public readonly children: Node[] = [];
  public readonly links: Link[] = [];
  public readonly velocity: Sides = [0, 0, 0, 0];

  constructor(
    public readonly position: Sides,
  ) {}

  /** Add or create Node at random location */
  public addNode(node?: Node): Node {
    if (!node) {
      const x = this.left + Math.random() * this.width;
      const y = this.bottom + Math.random() * this.height;
      node = new Node([x, y, x, y]);
    }
    node.parent = this;
    this.children.push(node);
    return node;
  }

  /** Create a Text node at random location */
  public addText(label: string, width: number, height: number): Text {
    const x = this.left + width / 2 + Math.random() * (this.width - width);
    const y = this.bottom + height / 2 + Math.random() * (this.height - height);
    // console.log(
    //   `Adding text "${label}" at (${x.toFixed(2)}, ${
    //     y.toFixed(2)
    //   }) with size (${width}, ${height})`,
    // );
    // const x = this.left +Math.random() * this.height;
    const text = new Text(label, x, y, width, height);
    text.parent = this;
    this.children.push(text);
    return text;
  }

  /** Add bidirectional link to other node */
  public addLink(other: Node): Link {
    const link = new Link(this, other);
    this.links.push(link);
    other.links.push(link);
    return link;
  }

  /** Left edge position */
  public get left(): number {
    return this.position[0];
  }

  /** Bottom edge position */
  public get bottom(): number {
    return this.position[1];
  }

  /** Right edge position */
  public get right(): number {
    return this.position[2];
  }

  /** Top edge position */
  public get top(): number {
    return this.position[3];
  }

  /** Width */
  public get width(): number {
    return this.right - this.left;
  }

  /** Height */
  public get height(): number {
    return this.top - this.bottom;
  }

  /** Mass = Area */
  public get mass(): number {
    // return 1 + Math.sqrt(this.width * this.height);
    return Math.max(1, this.width * this.height);
  }

  /** Center x */
  public get x(): number {
    return (this.left + this.right) / 2;
  }

  /** Middle y */
  public get y(): number {
    return (this.bottom + this.top) / 2;
  }

  /** Applying force to change velocity */
  public applyForce(force: Sides): void {
    const mass = this.mass;
    // const velocityBefore = [...this.velocity];
    [0, 1, 2, 3].forEach((i) => this.velocity[i] += force[i] / mass);
    // console.debug(
    //   `Applied force to node at (${this.x.toFixed(2)}, ${this.y.toFixed(2)}):`,
    //   mass,
    //   force,
    //   "New velocity:",
    //   this.velocity,
    //   "Velocity before:",
    //   velocityBefore,
    //   "Velocity change:",
    //   this.velocity.map((v, i) => v - velocityBefore[i]),
    // );
  }

  /** Move edge positions */
  public move(): number {
    let totalVelocity = 0;

    // New positions
    const step = .11;
    const newPos: Sides = [
      this.position[0] - this.velocity[0] * step,
      this.position[1] - this.velocity[1] * step,
      this.position[2] + this.velocity[2] * step,
      this.position[3] + this.velocity[3] * step,
    ];

    // Guardrail #1: No negative width or height
    // Remediation: Meet in the middle and reverse velocity
    if (newPos[2] < newPos[0]) {
      console.log("G#1 Left/right crossed");
      const mid = (newPos[0] + newPos[2]) / 2;
      newPos[0] = mid;
      newPos[2] = mid;
      this.velocity[0] = -this.velocity[0];
      this.velocity[2] = -this.velocity[2];
    }
    if (newPos[3] < newPos[1]) {
      console.log("G#1 Top/bottom crossed");
      const mid = (newPos[1] + newPos[3]) / 2;
      newPos[1] = mid;
      newPos[3] = mid;
      this.velocity[1] = -this.velocity[1];
      this.velocity[3] = -this.velocity[3];
    }

    // Move edges
    [0, 1, 2, 3].forEach((i) => {
      this.position[i] = newPos[i];
      this.velocity[i] *= 0.9; // Friction
      totalVelocity += Math.abs(this.velocity[i]);
    });

    // Move children
    this.children.forEach((c) => totalVelocity += c.move());

    return totalVelocity;
  }
}

/** Text label with parent and no children */
export class Text extends Node {
  /** Create a Text node with fixed size */
  constructor(
    public readonly label: string,
    center: number, // X position
    middle: number, // Y position
    // Width and height varies in terminal and pixel canvas
    private readonly _width: number,
    private readonly _height: number,
  ) {
    const position: Sides = [
      center - _width / 2,
      middle - _height / 2,
      center + _width / 2,
      middle + _height / 2,
    ];
    super(position);
  }

  /** Fixed width */
  public override get width(): number {
    return this._width;
  }

  /** Fixed height */
  public override get height(): number {
    return this._height;
  }

  /** Text cannot have children */
  public override addNode(): Node {
    throw new Error("Text cannot have children");
  }

  /** Text cannot have children */
  public override addText(
    _label: string,
    _width: number,
    _height: number,
  ): Text {
    throw new Error("Text cannot have children");
  }

  /** Match sides to maintain fixed size */
  public override move(): number {
    // Match left and right velocity to maintain fixed width
    const vdx = this.velocity[2] + this.velocity[0];
    const vx = this.velocity[2] - vdx / 2;
    this.velocity[0] = -vx;
    this.velocity[2] = vx;

    // Match top and bottom velocity to maintain fixed height
    const vdy = this.velocity[3] + this.velocity[1];
    const vy = this.velocity[3] - vdy / 2;
    this.velocity[1] = -vy;
    this.velocity[3] = vy;

    // console.log(
    //   "Moving text node:",
    //   this.label,
    //   "Velocity before:",
    //   velocityBefore,
    //   "Velocity after:",
    //   this.velocity,
    // );

    super.move();
    return Math.abs(vx) + Math.abs(vy);
  }
}
