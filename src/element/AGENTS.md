# Diagram Elements

## Node

## Node elasticity

A node is defined by its sides; left, bottom, right and top. Forces are applied
to node sides individually, and sides move independently, which effectively
resizes the node.

- Size and position defined by it's four edges.
- Can have one parent.
- Can have a number of children.
- Edges move individually.

## Canvas

Canvas is a regular Node with no parent. It is the root of the node tree.

- Has no parent.
- Edges do not move because force functions return zero for nodes with no
  parent.
- Children are constrained within canvas bounds by movement guardrails (cannot
  leave canvas).

## Text

Like a node, but

- Has label of text
- Size is fixed and cannot resize
- All edges move together.
- Cannot have children.

## Link

Connection between two nodes, except Canvas.

- Has endpoints in the middle of nodes
- Has no size
- Has a length which is Euclidean distance between midpoints of connected nodes.
