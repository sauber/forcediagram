---
name: deno-modern
description: Use when writing, reviewing, or planning Deno/TypeScript code. Covers modern Deno idioms including deno.json configuration, JSR imports, explicit .ts extensions, Deno.test patterns, @std/assert, web-standard API preference (no Node.js compatibility), type-first patterns, deno lint/fmt/check, and permission model. Trigger keywords: deno, typescript, jsr, deno test, deno lint, deno fmt, deno check, deno.json, import map, @std/assert, Deno.test.
---

# Modern Deno Code Development

## Project Configuration (`deno.json`)

- Use `deno.json` (not `package.json`) for project configuration — tasks, import
  maps, compiler options, and lint/format settings.
- Prefer import maps (`"imports"`) in `deno.json` to alias JSR/npm specifiers so
  imports are clean bare specifiers throughout the codebase.
- Pin `@std/*` library versions explicitly (e.g., `jsr:@std/assert@^1.0.19`).
- Disable lockfiles (`"lock": false`) for simple projects where reproducibility
  isn't critical.
- Avoid `node_modules` — Deno resolves dependencies from the registry directly.

```json
{
  "imports": {
    "@std/assert": "jsr:@std/assert@^1.0.19"
  },
  "lock": false
}
```

## Module System

- **Always include the `.ts` extension** on relative imports:
  `import { Foo } from "./foo.ts"`. Never omit it or use `/index.ts`.
- **Re-export all public symbols** from a directory via a single `mod.ts` file
  in that directory. For example, `src/force/mod.ts` re-exports every public
  function/type from each file in `src/force/`.
  - Modules in **other directories** import from `mod.ts` (via the directory
    path, e.g., `"../force/"`) — never from individual files.
  - Modules in the **same directory** import directly from the source file
    (e.g., `"./repulse.ts"`) — never from `mod.ts` (avoid circular re-exports).
- **No `node:` specifiers** — prefer web-standard APIs (`fetch`, `console`,
  `TextEncoder`, `URL`, etc.) over Node compatibility.
- **No `npm:` imports** unless absolutely necessary. Prefer JSR (`jsr:`) or
  `jsr.io` for packages.
- Use `export type` for type-only exports. Use `import type` for type-only
  imports.

## Testing

- Use the built-in `Deno.test(name, fn)` runner — no external test framework.
- Co-locate test files as `*.test.ts` alongside the source files they test.
- Use `@std/assert` for assertions: `assertEquals`, `assertAlmostEquals`,
  `assertThrows`, `assertGreater`, `assertLess`, `assertInstanceOf`,
  `assertNotEquals`, `assertStrictEquals`.
- Prefer **synchronous tests** unless the code under test is async.
- Use **parameterized test data** as arrays of tuples/objects iterated inside a
  single `Deno.test`.
- No `beforeEach`/`afterEach` hooks — use inline setup or small helper
  functions.

```ts
import { assertEquals } from "@std/assert";
import { add } from "./math.ts";

Deno.test("adds two numbers", () => {
  assertEquals(add(2, 3), 5);
});
```

## Linting, Formatting, Type Checking

- **Linting**: `deno lint` — adheres to Deno's built-in lint rules. Avoid
  disabling rules.
- **Formatting**: `deno fmt` — use default settings (2-space indent, single
  quotes are not enforced). Let the formatter handle style.
- **Type checking**: `deno check` — run before commits to catch type errors.
  Equivalent to `tsc --noEmit`.
- Run all three: `deno lint && deno fmt --check && deno check`.

## Web-Standard APIs Over Node.js APIs

- Use `console.log`, `console.error` for output.
- Use `URL`, `TextEncoder`, `TextDecoder`, `fetch`, `setTimeout`,
  `AbortController`, `ReadableStream`, `WritableStream`, `WebSocket` — all
  available globally.
- Avoid `process.env`; use `Deno.env.get("VAR")` when environment access is
  needed.
- Avoid `Buffer`, `require`, `__dirname`, `__filename`, `path`, `fs` — these are
  Node.js APIs.
- For file I/O: `Deno.readTextFile`, `Deno.writeTextFile`, `Deno.readDir`, etc.
- For HTTP servers: `Deno.serve` (uses web-standard `Request`/`Response`).

## Documentation

- **All exported symbols** (types, interfaces, functions, classes, methods,
  constants) must have a JSDoc comment describing their purpose.
- Use `/** ... */` (not `//` or `/* ... */`) for JSDoc so editors and `deno doc`
  pick them up.
- Document parameters with `@param` and return values with `@returns` when the
  intent isn't obvious from the type signature.

```ts
/** Calculates the area of a circle. */
export function circleArea(radius: number): number {
  return Math.PI * radius ** 2;
}

/** Represents a node in the force simulation graph. */
export type Node = {
  /** Unique identifier for this node. */
  id: string;
  /** Nesting depth (0 = root). */
  depth: number;
};
```

## TypeScript Patterns

- Use **`type` over `interface`** for most definitions. Prefer `type` for
  tuples, function signatures, unions, and shapes.
- Use `readonly` on constructor parameters and properties that shouldn't be
  reassigned.
- **Always annotate return types** on exported functions and methods.
- Use `as` type assertions sparingly — prefer `satisfies` or explicit typing.
- Use `override` keyword when extending class methods.
- Use explicit `public`/`private` access modifiers on class members.
- Model domain primitives as fixed-length tuple types.

```ts
type Sides = [number, number, number, number];
type Force = (node: Node) => Sides;
```

## Architecture Patterns

- Model domain logic with **classes** for stateful entities (`Node`,
  `Simulation`) and **pure functions** for stateless operations (forces,
  calculations).
- Favor **function composition** over class hierarchies for extensibility (e.g.,
  strategy pattern via function composition).
- Keep **functions small and single-purpose**. Each exported function should be
  independently testable.
- Use **getter properties** (`get width()`) for computed fields on classes.
- Group code in blocks preceded by a single `//` comment line explaining the
  purpose (per this project's convention).

## Async Patterns

- Prefer `async`/`await` over raw `.then()` chains.
- Use `Promise.all` for concurrent independent operations.
- Use `jsr:@std/async/delay` when a pause is needed — never `setTimeout` with
  promisification.

## Tasks (`deno task`)

- Define common commands as tasks in `deno.json` under `"tasks"`:

```json
{
  "tasks": {
    "example": "deno run example.ts"
  }
}
```

- Run with `deno task <name>`.

## Permissions

- Deno requires explicit `--allow-*` flags for I/O, network, env, etc.
- For most library code, no permissions are needed — the project can run with
  `deno test` (no flags).
- Only grant the minimum permissions required: `--allow-read` for file reading,
  `--allow-net` for networking, etc.
- Use `deno run --allow-read --allow-write script.ts` — never `--allow-all`.
