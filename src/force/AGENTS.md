## Diagram forces

A number of forces are in effect:

- [x] Repulsion: A node pulls away from other nodes of same parent
- [x] Containment: A node pulls inwards from parent edges (also from Canvas)
- [x] Implosion: A node contracts onto itself to minimize size
- [x] Center: A node seeks towards center of parent (also of Canvas)
- [x] Embracement: A parent node pulls away from child nodes
- [x] Alignment: Sibling nodes pull towards aligning edges, for example to have
      left edge at same position.
- [x] Sizing: Sibling nodes pull towards having same size
- [x] Grid: Edges of nodes pull towards canvas grid lines
- [x] Overlap: Repulsion of overlapping nodes, overlapping links or overlapping
      of links and nodes.
- [x] Cross avoidance: Links repulse from crossing each other
- [x] Guardrail: Canvas children repulsed from canvas edges
- [x] Orthogonality: Links pull towards being vertical or horizontal
- [x] Length: Links from same node approach same length

All forces are one dimensional, just like the position of the edge is either X
or Y. A force pulling edges outwards away from it's own center as a positive
amplitude. A negative force is contractional.

Primarily forces are applied within Nodes. Each node identifies if the
particular force is applicable it it's own and external situation, such as
looking for nearest neighbor and distance, and applies relevant forces to own
edges.
