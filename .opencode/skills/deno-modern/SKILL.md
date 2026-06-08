---
name: deno-modern
description: Use when writing, reviewing, or planning Deno/TypeScript code. Covers modern Deno idioms including deno.json configuration, JSR imports, explicit .ts extensions, Deno.test patterns, @std/assert, web-standard API preference (no Node.js compatibility), type-first patterns, deno lint/fmt/check, and permission model. Trigger keywords: deno, typescript, jsr, deno test, deno lint, deno fmt, deno check, deno.json, import map, @std/assert, Deno.test.
---

# Modern Deno Code

## Config
- Use `deno.json` (not package.json) with import maps for JSR specifiers.
- Always include `.ts` extension on relative imports. Re-export directory public API via `mod.ts`.
- No `node:` or `npm:` specifiers — prefer web-standard APIs.

## Testing
- `Deno.test(name, fn)` with `@std/assert`. Co-locate `*.test.ts` beside source.
- Prefer sync tests. Use parameterized data arrays. No beforeEach/afterEach.

## Tooling
- `deno lint` / `deno fmt` / `deno check` — run all three before commit.

## Web APIs over Node
- Use `fetch`, `URL`, `Deno.env.get`, `Deno.serve`, `Deno.readTextFile` — no `Buffer`, `require`, `fs`, `path`.

## Types
- Prefer `type` over `interface`. Annotate return types on exports. Use `readonly`, `satisfies`, `override` where appropriate.

## Patterns
- Classes for stateful entities, pure functions for stateless logic. Function composition over class hierarchies. Group code in blocks with a single `//` comment.
