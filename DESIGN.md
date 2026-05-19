# Interactive Hierarchical Spring-Force Engine

## Overview

Develop a high-performance web application that renders interactive, nested diagrams from a YAML definition. The system uses a specialized Spring-Force simulation where parent frames dynamically resize based on their children, and connection lines..

## Logic & Data Schema

YAML Definition: Parse nodes, links, and options.

Hierarchy: Frames are parent nodes and can contain sub-frames and optionally one text node. Frames have at least one child node. Text is always a leaf node.

Validation: Provide real-time error feedback if the YAML structure violates hierarchy rules.

Reactivity: Debounce YAML input (500ms) before re-calculating the simulation.

## Physics & Collision Engine

Containment & Resizing: Parent nodes must automatically resize to fully contain all nested children. Apply Margin Force to maintain internal spacing between the frame edge and its children.

Hard-Body Collisions: Nodes should not overlap. Implement a repulsion force between sibling nodes to maintain the padding distance.

Rest State: Stop the physics loop when global tension or velocity fall below a minimum threshold to save CPU.

## Connection Routing

No Overlap: Connection lines should not overlap any nodes (frames or text).

Line Crossing: Lines should not cross over other connection lines.

## Interactive Features

Direct Manipulation: Users can click and drag any node.

Recursive Dragging: When a parent frame is dragged, all nested children and sub-frames move synchronously, maintaining their relative positions.

Modes:

Force Mode: Active physics and spring-based movement.

Snap Mode: Physics is suspended; nodes and frame edges snap to the grid increments.

Export: Include a "Download SVG" button to export the current diagram state including css for styling.

## UI/UX Design

Aesthetics: Minimalistic, Swiss-style design (clean lines, monochromatic palette, sans-serif typography).

Canvas Environment: Display a background grid based on the grid option.

HUD overlay showing real-time Global Tension and Global Velocity.

Rendering Depth: Draw parent frames at the bottom, children inside them, and connection lines at the very top.

## Sample Configuration

```YAML
nodes:
  box1:
    text: Start
  box2:
    box3:
      text: Process A
    box4:
      text: Process B
    text: Main Logic
  box5:
    text: End
links:
  - [box1, box3]
  - [box3, box4]
  - [box4, box5]
options:
  line: 120
  grid: 25
  margin: 15
  padding: 40
```
