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

## Bugs

- [ ] Link length uses midpoint-to-midpoint, should be edge-to-edge
  - Objective: `Link.length` returns distance between closest edges of connected
    nodes; negative when nodes overlap.
  - Problem: Currently returns Euclidean distance between node midpoints, which
    doesn't reflect actual gap between node borders. Edge-to-edge distance is
    needed for accurate length/link forces.
  - Files: src/element/link.ts, src/element/link.test.ts, src/force/length.ts
  - Validation: src/element/link.test.ts

- [ ] Nested nodes grow too tall and escape canvas
  - Objective: Nested nodes remain within canvas bounds and keep reasonable
    height proportional to content.
  - Problem: Children of non-canvas parent nodes grow excessively tall and
    extend outside the canvas. Likely caused by feedback between `embraceForce`
    (pulling parent edges outward) and `containmentForce`/`implodeForce` on
    children, creating runaway expansion.
  - Files: src/force/embrace.ts, src/force/contain.ts, src/force/implode.ts
  - Validation: src/force/embrace.test.ts, src/force/contain.test.ts,
    src/force/implode.test.ts

- [ ] Guardrail force too narrow — stuck nodes outside canvas
  - Objective: All nodes outside canvas bounds are pushed back inside by
    guardrail force, regardless of nesting depth.
  - Problem: `guardrailForce` only applies to direct children of canvas
    (`!node.parent.parent`). Nested nodes (children of non-canvas parents) that
    extend beyond canvas get no guardrail force and remain stuck with near-zero
    velocity.
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
