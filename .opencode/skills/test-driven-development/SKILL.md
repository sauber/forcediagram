---
name: test-driven-development
description: Use when writing code following Test Driven Development (TDD) — write tests first, implement, then refactor. Covers the Red-Green-Refactor cycle, test case decomposition, and validation strategy. Trigger keywords: TDD, test driven development, red green refactor, test first, write tests before code, failing test, triangulation, baby steps, test case.
---

# Test Driven Development

## The Red-Green-Refactor Cycle

Follow this cycle for every unit of behavior. Do not skip phases.

1. **Red** — Write a failing test for the next behavior you want.
   - The test should fail for the *right reason* (the feature doesn't exist yet, not because of a compile error or test bug).
   - Run the test suite and confirm it fails.

2. **Green** — Write the simplest code that makes the test pass.
   - Do not generalize or add features beyond what the test demands.
   - Duplication, hard-coded values, and ugly code are allowed here — you'll clean it up next.

3. **Refactor** — Improve the code while keeping all tests green.
   - Remove duplication, rename variables, extract functions, simplify logic.
   - Run tests after every change to confirm the refactor didn't break anything.

## Writing Test Cases

- **Start with the simplest case** — the degenerate or empty/zero input.
- **Add one behavior at a time** — each test should introduce exactly one new expectation.
- **Use descriptive test names** that state the expected behavior: `"returns empty array when no nodes"`, `"positions child nodes inside parent bounds"`.
- **Validate the specific invariant** that matters for the current step — avoid testing unrelated details.

```ts
import { assertEquals } from "@std/assert";

Deno.test("returns 0 for empty list", () => {
  assertEquals(calculateTotal([]), 0);
});

Deno.test("returns the single item price for one-item list", () => {
  assertEquals(calculateTotal([{ price: 5 }]), 5);
});
```

## Triangulation

When you're unsure of the correct generalization, write **three or more test cases** that force the implementation to be correct:

```ts
Deno.test("area of circle", () => assertEquals(area({ type: "circle", r: 1 }), Math.PI));
Deno.test("area of rect", () => assertEquals(area({ type: "rect", w: 2, h: 3 }), 6));
Deno.test("area of triangle", () => assertEquals(area({ type: "triangle", b: 4, h: 3 }), 6));
```

Only write the minimal implementation once all cases are red.

## Validation Strategy

- **One test at a time**: Write one test, make it pass, refactor, then move to the next.
- **Do not skip ahead**: If a later test passes before earlier ones, you've over-implemented — revert to the minimal code.
- **Run the full suite** after each green and refactor step — ensure you haven't broken prior behavior.
- **When stuck**: Write a smaller, simpler test that isolates the problem.

## Organizing Test Files

- Co-locate `*.test.ts` with the source file (per AGENTS.md convention).
- Group related tests within a single `Deno.test` using a descriptive scope.
- Use helper functions for common setup, but keep them in the test file itself (no test utils shared across files unless duplicated 3+ times).

## Common Anti-Patterns

| Anti-pattern | Why it's wrong |
|---|---|
| Writing the implementation first | Defeats the purpose of TDD — you lose the design feedback of the test |
| Tests that cover multiple behaviors at once | Hard to pin down which behavior is broken; violates "one test, one behavior" |
| Refactoring before the test is green | You don't yet know the simplest correct design |
| Over-generalizing in the green phase | Adds untested code; violates "write only what the test demands" |
| Skipping refactor | Accumulates technical debt that slows future TDD cycles |
