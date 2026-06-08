# Pending Tasks

List of pending tasks

### Format

Each todo item has the following format:

```
- [ ] Title
  - Objective: Desired outcome
  - Problem: Current shortcoming, such as bug or not implemented
  - Files: Name of primary file
  - Validation: Name of file holding testing cases
```

When item is completed change `[ ]` to `[✅]`

## Documentation

- [✅] Update src/render/AGENTS.md
  - Objective: Match documentation to actual implementation
  - Problem: References AsciiRenderer from ./ansi.ts but actual module is
    dashboard() in dashboard.ts
  - Files: src/render/AGENTS.md
  - Validation: N/A

- [✅] Update src/force/AGENTS.md checkbox states
  - Objective: Mark Repulsion as implemented, adjust descriptions
  - Problem: Repulsion checkbox shows `[ ]` but repulse.ts is fully implemented
  - Files: src/force/AGENTS.md
  - Validation: N/A

- [✅] Update src/element/AGENTS.md
  - Objective: Clarify Canvas immovable edge behavior
  - Problem: States "Edges cannot move" but no explicit immovability mechanism
    exists; Canvas avoids movement because no forces apply to root nodes
  - Files: src/element/AGENTS.md
  - Validation: N/A

- [✅] Update DESIGN.md implementation status
  - Objective: Reflect actual implementation completeness
  - Problem: DESIGN.md marks all sections as complete but 6 of 11 forces remain
    unimplemented
  - Files: DESIGN.md
  - Validation: N/A

## Linting / Code Quality

- [✅] Fix no-import-prefix lint error in example.ts
  - Objective: Keep inline `jsr:` import in example.ts for standalone
    runnability; suppress lint rule with `// deno-lint-ignore-file` directive
    and add `@std/async` to deno.json for project use
  - Problem: `jsr:@std/async` inline import in example.ts triggers
    `no-import-prefix` lint error
  - Files: example.ts, deno.json
  - Validation: `deno lint` passes

- [✅] Remove unused variable velocityBefore
  - Objective: Clean up dead code in Text.move()
  - Problem: `velocityBefore` variable is assigned but never read
  - Files: src/element/node.ts
  - Validation: `deno lint` passes

## Bugs

- [ ] Link length uses midpoint-to-midpoint, should be edge-to-edge
  - Objective: `Link.length` returns distance between closest edges of connected
    nodes; negative when nodes overlap.
  - Problem: Currently returns Euclidean distance between node midpoints, which
    doesn't reflect actual gap between node borders. Edge-to-edge distance is
    needed for accurate length/link forces.
  - Files: src/element/link.ts, src/element/link.test.ts, src/force/length.ts
  - Validation: src/element/link.test.ts

- [ ] Guardrail force too narrow — stuck nodes outside canvas
  - Objective: All nodes outside canvas bounds are pushed back inside by
    guardrail force, regardless of nesting depth.
  - Problem: `guardrailForce` only applies to direct children of canvas
    (`!node.parent.parent`). Nested nodes (children of non-canvas parents) that
    extend beyond canvas get no guardrail force and remain stuck with near-zero
    velocity.
  - Files: src/force/node.ts
  - Validation: src/force/node.test.ts

- [✅] Guardrail for staying in canvas
  - Objective: Keep nodes inside canvas
  - Problem: Not implemented. Current guardrail expands parent, but for for root
    node children should move instead.
  - Files: src/force/node.ts
  - Validation: src/force/node.test.ts

## Missing Features

- [ ] Grid force scope too broad
  - Objective: Grid forces only pull direct canvas children toward grid lines,
    leaving nested node layout unaffected.
  - Problem: `gridForce` applies to all non-root nodes, which pulls nested
    nodes toward grid lines and can misalign them inside their parent box.
  - Files: src/force/grid.ts
  - Validation: src/force/grid.test.ts

- [✅] Alignment force
  - Objective: Sibling nodes pull towards aligning edges
  - Problem: Not implemented
  - Files: src/force/align.ts
  - Validation: src/force/align.test.ts

- [✅] Sizing force
  - Objective: Sibling nodes pull towards having same size
  - Problem: Not implemented
  - Files: src/force/size.ts
  - Validation: src/force/size.test.ts

- [✅] Grid force
  - Objective: Edges of nodes pull towards canvas grid lines
  - Problem: Not implemented
  - Files: src/force/grid.ts
  - Validation: src/force/grid.test.ts

- [✅] Link cross avoidance
  - Objective: Repulsion of overlapping links crossing each other
  - Problem: Not implemented. Links may cross
  - Files: src/force/cross.ts
  - Validation: src/force/cross.test.ts

- [✅] Link
  - Objective: module for link definition
  - Problem: Not implemented. Required for Orthogonality and Length forces.
  - Files: src/element/link.ts
  - Validation: src/element/link.test.ts

- [✅] Orthogonality force
  - Objective: Links pull towards being vertical or horizontal
  - Problem: Not implemented. Depends on Link element.
  - Files: src/force/orthogonal.ts
  - Validation: src/force/orthogonal.test.ts

- [✅] Length force
  - Objective: Links pull towards having same length
  - Problem: Not implemented. Depends on Link element.
  - Files: src/force/length.ts
  - Validation: src/force/length.test.ts

- [✅] Update example.ts imports to use mod.ts
  - Objective: Change all src/ imports in example.ts to reference mod.ts files
    (e.g., `"./src/force/"`) instead of individual source files.
  - Problem: example.ts imports directly from individual files (e.g.,
    `"./src/force/center.ts"`), which violates the mod.ts convention for
    cross-directory imports.
  - Files: example.ts
  - Validation: `deno run example.ts` runs without errors

- [✅] Create mod.ts barrel files in each src/ subdirectory
  - Objective: Add `mod.ts` to each src/ subdirectory re-exporting all public
    symbols; update cross-directory imports to reference via `mod.ts`; keep
    same-directory imports pointing directly to source files.
  - Problem: No `mod.ts` files exist; each file is imported directly regardless
    of directory relationship, violating the mod.ts convention.
  - Files: src/element/mod.ts, src/force/mod.ts, src/render/mod.ts,
    src/simulation/mod.ts
  - Validation: `deno check` and `deno test` pass

- [✅] Integrate links into simulation forces
  - Objective: Links parameter should drive edge/length forces in simulation
    loop
  - Problem: Links are accepted by Simulation constructor but not used in force
    calculations
  - Files: src/simulation/simulation.ts
  - Validation: src/simulation/simulation.test.ts

- [✅] Simulation guardrails
  - Objective: Guardrails are simulation features
  - Problem: Currently guardrails are implemented and applied inside nodes. Move
    guardrails to simulation loop.
  - Files: src/element/node.ts, src/simulation/simulation.ts
  - Validation: src/element/node.test.ts, src/simulation/simulation.test.ts
