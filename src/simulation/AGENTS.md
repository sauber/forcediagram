# Simulation Module

Runs the physics simulation loop.

- Applies configured forces to all nodes
- Moves nodes based on accumulated velocity
- Applies guardrails (parent expansion, canvas clamping)
- Calls optional callback after each iteration for rendering
- Stops when total velocity falls below threshold

## Exports

- `Simulation` — class accepting a root `Node`, array of `Force` functions, and
  optional `Link` array. Exposes `settle(maxIterations, velocityThreshold, callback?)`.
- `CallBack` — type for the iteration callback function.
