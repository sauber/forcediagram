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

When item is completed change `[ ]` to `[x]`

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

- [ ] Simulation
  - Objective: module for running loop of simulation steps
  - Problem: Not implemented
  - Files: src/simulation/simulation.ts
  - Validation: src/simulation/simulation.test.ts

## Rendering

- [ ] Ascii Rendering Module
  - Objective: Create module for ansi rendering
  - Problem: Rendering is implemented in loop.ts file and should be moved to own
    module
  - Files: src/render/ansi.ts
  - Validation: src/render/ansi.test.ts
