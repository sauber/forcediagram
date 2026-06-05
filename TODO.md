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

- [ ] Fix unused import prefix in loop.ts
  - Objective: Replace inline `jsr:` import with deno.json dependency
  - Problem: `jsr:@std/async` inline import triggers `no-import-prefix` lint
    error
  - Files: loop.ts, deno.json
  - Validation: `deno lint` passes

- [ ] Remove unused variable velocityBefore
  - Objective: Clean up dead code in Text.move()
  - Problem: `velocityBefore` variable is assigned but never read
  - Files: src/element/node.ts
  - Validation: `deno lint` passes

## Missing Features

- [ ] Alignment force
  - Objective: Sibling nodes pull towards aligning edges
  - Problem: Not implemented
  - Files: src/force/align.ts
  - Validation: src/force/align.test.ts

- [ ] Sizing force
  - Objective: Sibling nodes pull towards having same size
  - Problem: Not implemented
  - Files: src/force/size.ts
  - Validation: src/force/size.test.ts

- [ ] Grid force
  - Objective: Edges of nodes pull towards canvas grid lines
  - Problem: Not implemented
  - Files: src/force/grid.ts
  - Validation: src/force/grid.test.ts

- [ ] Overlap repulsion
  - Objective: Repulsion of overlapping nodes, links, or links and nodes
  - Problem: Overlap between links and nodes is not handled
  - Files: src/force/repulse.ts
  - Validation: src/force/repulse.test.ts

- [ ] Link
  - Objective: module for link definition
  - Problem: Not implemented. Required for Orthogonality and Length forces.
  - Files: src/element/link.ts
  - Validation: src/element/link.test.ts

- [ ] Orthogonality force
  - Objective: Links pull towards being vertical or horizontal
  - Problem: Not implemented. Depends on Link element.
  - Files: src/force/orthogonal.ts
  - Validation: src/force/orthogonal.test.ts

- [ ] Length force
  - Objective: Links pull towards having same length
  - Problem: Not implemented. Depends on Link element.
  - Files: src/force/length.ts
  - Validation: src/force/length.test.ts

- [ ] Integrate links into simulation forces
  - Objective: Links parameter should drive edge/length forces in simulation
    loop
  - Problem: Links are accepted by Simulation constructor but not used in force
    calculations
  - Files: src/simulation/simulation.ts
  - Validation: src/simulation/simulation.test.ts
