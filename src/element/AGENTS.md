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

Like a node, but

- Top level node
- Has no parent.
- Edges cannot move

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
- Has a length which is distance from edge to edge of connected nodes, and note
  distance between midpoints of nodes.
