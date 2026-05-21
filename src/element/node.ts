// Vector of Left, Bottom, Right and Top
export type Sides = [number, number, number, number];

/** Rectangle node */
export class Node {
  public parent: Node | undefined;
  public readonly children: Node[] = [];
  public readonly velocity: Sides = [0, 0, 0, 0];

  constructor(
    public readonly position: Sides,
  ) {}

  // Add or create Node at random location
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

  // Create a Text node at random location
  public addText(label: string, width: number, height: number): Text {
    const x = this.left + Math.random() * this.width;
    const y = this.bottom + Math.random() * this.height;
    const text = new Text(label, x, y, width, height);
    text.parent = this;
    this.children.push(text);
    return text;
  }

  public get left(): number {
    return this.position[0];
  }

  public get bottom(): number {
    return this.position[1];
  }
  public get right(): number {
    return this.position[2];
  }

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
    [0, 1, 2, 3].forEach((i) => this.velocity[i] += force[i] / mass);
  }

  /** Move edge positions */
  public move(): number {
    let totalVelocity = 0;

    // New positions
    const step = 0.01;
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

    // Guardrail #2: Parent should contain children
    // Remediation: Push parent to fit child and match velocity
    // Exception: Canvas node has no parent and cannot change size
    if (this.parent) {
      const pp = this.parent.position;
      const vv = this.parent.velocity;

      if (this.parent.parent) {
        // console.log({ newPos, parentPos: pp });
        if (newPos[0] < pp[0]) {
          // console.log("G#2 Child left outside parent");
          // Deno.exit(1);
          pp[0] = newPos[0];
          vv[0] = this.velocity[0];
        }
        if (newPos[1] < pp[1]) {
          // console.log("G#2 Child bottom outside parent");
          // Deno.exit(1);
          pp[1] = newPos[1];
          vv[1] = this.velocity[1];
        }
        if (newPos[2] > pp[2]) {
          // console.log("G#2 Child right outside parent");
          // Deno.exit(1);
          pp[2] = newPos[2];
          vv[2] = this.velocity[2];
        }
        if (newPos[3] > pp[3]) {
          // console.log("G#2 Child top outside parent");
          // Deno.exit(1);
          pp[3] = newPos[3];
          vv[3] = this.velocity[3];
        }
      } else {
        // Check if top nodes reach beyond canvas size and reverse velocity
        const canvas = pp;
        if (newPos[0] < canvas[0]) {
          // console.log("G#2 Left outside canvas");
          newPos[0] = canvas[0];
          this.velocity[0] = -this.velocity[0];
        }
        if (newPos[1] < canvas[1]) {
          // console.log("G#2 Bottom outside canvas");
          newPos[1] = canvas[1];
          this.velocity[1] = -this.velocity[1];
        }
        if (newPos[2] > canvas[2]) {
          // console.log("G#2 Right outside canvas");
          newPos[2] = canvas[2];
          this.velocity[2] = -this.velocity[2];
        }
        if (newPos[3] > canvas[3]) {
          // console.log("G#2 Top outside canvas");
          newPos[3] = canvas[3];
          this.velocity[3] = -this.velocity[3];
        }
      }
    }

    // Move edges
    [0, 1, 2, 3].forEach((i) => {
      this.position[i] = newPos[i];
      this.velocity[i] *= 0.9; // Friction
      totalVelocity += Math.abs(this.velocity[i]);
    });

    // Generate a text string of node location and velocity for debugging
    const nodeInfo = (n: Node) =>
      `p: ${n.position.map((p) => parseFloat(p.toFixed(2)))} xy: ${
        [n.x, n.y].map((p) => parseFloat(p.toFixed(2)))
      } m: ${n.mass} v: ${n.velocity.map((v) => parseFloat(v.toFixed(2)))}${
        "label" in n ? " l: " + n.label : ""
      }`;

    // Guardrail #3: Confirm child within edges of parent after moving
    if (this.parent) {
      if (this.left < this.parent.left) {
        console.log("Parent:", nodeInfo(this.parent));
        console.log("Child:", nodeInfo(this));
        throw new Error("Left edge outside parent");
      }
      if (this.bottom < this.parent.bottom) {
        console.log("Parent:", nodeInfo(this.parent));
        console.log("Child:", nodeInfo(this));
        throw new Error("Bottom edge outside parent");
      }
      if (this.right > this.parent.right) {
        console.log("Parent:", nodeInfo(this.parent));
        console.log("Child:", nodeInfo(this));
        throw new Error("Right edge outside parent");
      }
      if (this.top > this.parent.top) {
        console.log("Parent:", nodeInfo(this.parent));
        console.log("Child:", nodeInfo(this));
        throw new Error("Top edge outside parent");
      }
    }

    // Move children
    this.children.forEach((c) => totalVelocity += c.move());

    return totalVelocity;
  }
}

/** Text label with parent and no children */
export class Text extends Node {
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

  public override get width(): number {
    return this._width;
  }

  public override get height(): number {
    return this._height;
  }

  public override addNode(): Node {
    throw new Error("Text cannot have children");
  }

  public override addText(
    _label: string,
    _width: number,
    _height: number,
  ): Text {
    throw new Error("Text cannot have children");
  }

  public override move(): number {
    // Combine left and right velocity tom maintain fixed width
    const vx = this.velocity[2] - this.velocity[0];
    this.velocity[0] = -vx;
    this.velocity[2] = vx;

    // Combine top and bottom velocity to maintain fixed height
    const vy = this.velocity[3] - this.velocity[1];
    this.velocity[1] = -vy;
    this.velocity[3] = vy;
    super.move();
    return Math.abs(vx) + Math.abs(vy);
  }
}
