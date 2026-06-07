---
name: doc-code-sync
description: Use when reviewing, updating, or ensuring consistency between documentation and implementation. Covers DESIGN.md, AGENTS.md, TODO.md, README.md, src/ code files, and example.ts. Trigger keywords: documentation, doc sync, AGENTS.md, DESIGN.md, TODO.md, README.md, documentation update, keep in sync, doc drift, stale docs.
---

# Documentation / Code Synchronization

## Scope

The following files must stay in sync with each other:

| File               | Purpose                                                    |
| ------------------ | ---------------------------------------------------------- |
| `DESIGN.md`        | High-level architecture overview and implementation status |
| `AGENTS.md`        | Development process, platform, and conventions             |
| `src/**/AGENTS.md` | Module-level design docs (one per domain directory)        |
| `TODO.md`          | Current task list with checkbox completion tracking        |
| `README.md`        | Public-facing project description                          |
| `example.ts`       | Runnable example demonstrating correct module imports      |
| `src/**/*.ts`      | Implementation and test files                              |

## Synchronization Rules

### 1. Intentions and status must match

- `DESIGN.md` Implementation Status section must list each implemented feature
  as ✅ and each unimplemented feature as ❌.
- `TODO.md` checkboxes (`[ ]` / `[✅]`) must reflect actual completion. When
  code is written and tests pass, mark the item done.
- When a TODO item is completed, remove the entry (or mark it `[✅]`) and update
  `DESIGN.md` status accordingly.

### 2. Documentation must match implementation

- **Module AGENTS.md files** (`src/*/AGENTS.md`):
  - Exported function/class names must match the actual code (e.g., if the
    module exports `dashboard()`, do not document `AsciiRenderer`).
  - File paths in code examples must be correct relative imports (e.g.,
    `./dashboard.ts` not `./ansi.ts`).
  - Checklist items (force list, element list, etc.) must have correct
    `[x]`/`[ ]` state matching implementation.
- **DESIGN.md**: Descriptions of architecture must reflect actual code
  structure. Do not claim features as complete that are not implemented.
- **README.md**: Usage examples and descriptions must match the actual API.

### 3. Example must work

- `example.ts` (or equivalent runnable entry point) must import modules using
  the same paths and names as documented.
- Running the example must not throw import or type errors.
- Example must demonstrate a realistic usage flow that exercises documented
  APIs.

### 4. No documentation redundancy

- Do not duplicate the same information across multiple doc files.
- Use references/cross-links instead: e.g., "See `src/force/AGENTS.md` for
  details" rather than copying force descriptions into DESIGN.md.
- Each piece of information should live in exactly one authoritative doc file.

## Common Drift Patterns to Catch

| Drift                   | Symptom                                                            | Fix                                                  |
| ----------------------- | ------------------------------------------------------------------ | ---------------------------------------------------- |
| Wrong file path in docs | Code example imports from `./ansi.ts` but file is `./dashboard.ts` | Update example to correct path                       |
| Outdated checklist      | Force listed as `[ ]` but `repulse.ts` exists with tests           | Toggle checkbox to `[x]`                             |
| Missing status update   | Feature implemented but DESIGN.md still says ❌                    | Update DESIGN.md status                              |
| Stale TODO              | Task marked `[ ]` but implementation and tests exist               | Mark `[✅]` or remove entry                          |
| Broken example          | `example.ts` imports a renamed/removed export                      | Fix import to match current API                      |
| Redundant docs          | Same force description copied into both DESIGN.md and AGENTS.md    | Keep it in AGENTS.md, cross-reference from DESIGN.md |

## Validation

Before marking any documentation task complete, verify:

1. **`deno check example.ts`** passes (no type errors).
2. **`deno test`** passes (all tests green).
3. **`deno lint`** passes (no lint warnings).
4. **Cross-reference check**: For every export mentioned in docs, confirm it
   exists in the source file at the documented path.
5. **Checkbox audit**: All `[x]` items in AGENTS.md files correspond to
   implemented code; all `[ ]` items correspond to genuinely missing code.
