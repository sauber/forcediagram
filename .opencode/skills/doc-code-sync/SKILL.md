---
name: doc-code-sync
description: Use when reviewing, updating, or ensuring consistency between documentation and implementation. Covers DESIGN.md, AGENTS.md, TODO.md, README.md, src/ code files, and example.ts. Trigger keywords: documentation, doc sync, AGENTS.md, DESIGN.md, TODO.md, README.md, documentation update, keep in sync, doc drift, stale docs.
---

# Doc/Code Sync

## Files to keep in sync
`DESIGN.md`, `AGENTS.md`, `src/*/AGENTS.md`, `TODO.md`, `README.md`, `example.ts`, `src/**/*.ts`

## Rules
1. **Status must match**: DESIGN.md ✅/❌ and TODO.md `[x]`/`[ ]` must reflect actual implementation.
2. **Docs match code**: exported names, file paths in examples, and checkbox states in module AGENTS.md must match source.
3. **Example works**: `deno check example.ts` must pass; example must use documented API paths.
4. **No redundancy**: cross-reference instead of duplicating info across doc files.

## Validation checklist
- `deno check example.ts` passes
- `deno test` passes
- `deno lint` passes
- Every doc-exported name exists in source at the documented path
- All `[x]` items correspond to real code, all `[ ]` to genuinely missing code
