## Diagram forces

A number of forces are in effect:

- [ ] Repulsion: A node pulls away from other nodes of same parent
- [x] Containment: A node pulls inwards from parent edges (also from Canvas)
- [x] Implosion: A node contracts onto itself to minimize size
- [x] Center: A node seeks towards center of parent (also of Canvas)
- [x] Embracement: A parent node pulls away from child nodes
- [ ] Alignment: Sibling nodes pull towards aligning edges, for example to have
      left edge at same position.
- [ ] Sizing: Sibling nodes pull towards having same size
- [ ] Grid: Edges of nodes pull towards canvas grid lines
- [ ] Overlap: Repulsion of overlapping nodes, overlapping links or overlapping
      of links and nodes.
- [ ] Orthogonality: Links pull towards being vertical or horizontal
- [ ] Length: Links pull towards having same length

All forces are one dimensional, just like the position of the edge is either X
or Y. A force pulling edges outwards away from it's own center as a positive
amplitude. A negative force is contractional.

Primarily forces are applied within Nodes. Each node identifies if the
particular force is applicable it it's own and external situation, such as
looking for nearest neighbor and distance, and applies relevant forces to own
edges.
