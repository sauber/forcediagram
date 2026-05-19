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
  public addText(label: string): Text {
    const x = this.left + Math.random() * this.width;
    const y = this.bottom + Math.random() * this.height;
    const text = new Text(label, x, y);
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

    // Confirm that left and right will not swap side if velocity is applied
    if (newPos[0] > newPos[2]) throw new Error("Negative width" + newPos);

    // Ditto height
    if (
      newPos[1] > newPos[3]
    ) throw new Error("Negative height" + newPos);

    // Confirm that sides do not exceed parent
    if (this.parent) {
      const pp = this.parent.position;
      if (newPos[0] < pp[0]) {
        throw new Error("Left escape " + newPos + pp);
      }
      if (newPos[1] < pp[1]) {
        throw new Error("Bottom escape " + newPos + pp);
      }
      if (newPos[2] > pp[2]) {
        throw new Error("Right escape " + newPos + pp);
      }
      if (newPos[3] > pp[3]) {
        throw new Error("Top escape " + newPos + pp);
      }
    }

    // Do the update
    [0, 1, 2, 3].forEach((i) => {
      this.position[i] = newPos[i];
      this.velocity[i] *= 0.9; // Friction
      totalVelocity += Math.abs(this.velocity[i]);
    });

    this.children.forEach((c) => totalVelocity += c.move());
    return totalVelocity;
  }
}

type TextMetrics = {
  text: string;
  width: number;
  height: number;
  textAlign: string;
  textBaseline: string;
  // x,y is center middle
  x: number;
  y: number;
};

/** Text label with parent and no children */
export class Text extends Node {
  private readonly measureText: TextMetrics;

  constructor(
    public readonly label: string,
    center: number, // X position
    middle: number, // Y position
  ) {
    // Chars are 8 pixels wide
    const width = label.length * 8;
    // Chars are 14 pixels heigh
    const height = 14;
    const position: Sides = [
      center - width / 2,
      middle - height / 2,
      center + width / 2,
      middle + height / 2,
    ];
    super(position);

    this.measureText = {
      text: label,
      width: width,
      height: height,
      x: center,
      y: middle,
      textAlign: "center",
      textBaseline: "middle",
    };
  }

  public override addNode(): Node {
    throw new Error("Text cannot have children");
  }

  public override addText(_label: string): Text {
    throw new Error("Text cannot have children");
  }

  public override get width(): number {
    return this.measureText.width;
  }

  public override get height(): number {
    return this.measureText.height;
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
