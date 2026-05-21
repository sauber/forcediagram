# Physics Force Engine for Positioning for Diagram Elements

## Overview

Position a tree of nodes using simulation of physics such as attraction and
repulsion from placement. Parent nodes dynamically resize to contain children.

## Physics Engine

A tree walker make sure all nodes have forces applied, first, and then walks
tree again for updating positions of edges.

A physics engine runs a loop of applying forces to each edge of all nodes and
updating positions. The engine stops when global velocity is under a threshold.
Global tension is sum of all forces applied.

## Elements:

See `src/element/AGENTS.md` for design.

## Forces:

See `src/force/AGENTS.md` for design.

## Simulation:

See `src/simulation/AGENTS.md` for design.

## Rendering

See `src/render/AGENTS.md` for design.
