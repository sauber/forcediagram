# Ascii Rendering Module

Handles terminal output rendering using ANSI escape codes. This module converts
node positions and labels into terminal-friendly ASCII art using the
`jsr:@sauber/ansi-draw` library.

## Key Features

- Renders nodes with labels or frames
- Supports tree structures
- Converts canvas to terminal string output

## Usage

```ts
import { dashboard } from "./dashboard.ts";

const output = dashboard(tree, iteration, velocity);
console.log(output);
```
