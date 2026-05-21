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

## Elements

- [ ] Link
  - Objective: module for link definition
  - Problem: Not implemented
  - Files: src/element/link.ts
  - Validation: src/element/link.test.ts

## Force

- [ ] Repulsion force
  - Objective: module for repulsion force
  - Problem: Not implemented
  - Files: src/force/repulsion.ts
  - Validation: src/force/repulsion.test.ts

## Simulation

- [x] Simulation
  - Objective: module for running loop of simulation steps
  - Requirements: class Simulation should take nodes and links as parameters for
    construction. It should have a settle(max_iterations, velocity, callback)
    method. The loop exits when max_iterations is reached, or global velocity is
    below velocity threshold. callback(nodes, links, iteration, velocity) is
    called after every iteration.
  - Problem: Not implemented
  - Files: src/simulation/simulation.ts
  - Validation: src/simulation/simulation.test.ts

- [✅] Add edge force to simulation loop
  - Objective: Include edge repulsion force in the simulation loop
  - Problem: Edge force is implemented but not used in the main simulation loop
  - Files: loop.ts
  - Validation: src/force/edge.test.ts

## Rendering

- [✅] Ascii Rendering Module
  - Objective: Create module for ansi rendering
  - Problem: Rendering is implemented in loop.ts file and should be moved to own
    module
  - Files: src/render/ansi.ts
  - Validation: src/render/ansi.test.ts

- [✅] Add rendering tests
  - Objective: Create tests for rendering functionality
  - Problem: No tests exist for rendering
  - Files: src/render/ansi.test.ts
  - Validation: src/render/ansi.test.ts

## Documentation

- [✅] Update AGENTS.md
  - Objective: Keep design documentation up to date
  - Problem: AGENTS.md files are outdated or missing details
  - Files: src/element/AGENTS.md, src/force/AGENTS.md, src/simulation/AGENTS.md,
    src/render/AGENTS.md
  - Validation: N/A

- [✅] Update DESIGN.md
  - Objective: Update high-level design document
  - Problem: DESIGN.md is incomplete and doesn't reflect current implementation
  - Files: DESIGN.md
  - Validation: N/A
