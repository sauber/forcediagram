---
name: test-driven-development
description: Use when writing code following Test Driven Development (TDD) — write tests first, implement, then refactor. Covers the Red-Green-Refactor cycle, test case decomposition, and validation strategy. Trigger keywords: TDD, test driven development, red green refactor, test first, write tests before code, failing test, triangulation, baby steps, test case.
---

# TDD: Red-Green-Refactor

1. **Red** — Write a failing test for the next behavior. Confirm it fails for the right reason.
2. **Green** — Write the simplest code to pass it. Don't generalize beyond the test.
3. **Refactor** — Clean up while keeping all tests green. Run suite after each change.

## Test cases
- Start with simplest/degenerate input. Add one behavior per test.
- Descriptive test names stating expected behavior.

## Triangulation
When unsure of correct generalization, write 3+ cases to force correctness.

## Validation
- One test at a time. Run full suite after each green and refactor.
- Don't skip ahead — if a later test passes before earlier ones, you've over-implemented.
- When stuck, write a smaller test isolating the problem.

## Anti-patterns
- Writing implementation first (defeats TDD)
- Tests covering multiple behaviors (hard to diagnose failures)
- Refactoring before green (premature optimization)
- Over-generalizing in green phase (untested code)
- Skipping refactor (accumulates debt)
