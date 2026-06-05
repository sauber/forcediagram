---
name: solid-principles
description: Use when designing, organizing, or refactoring code following SOLID principles (Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, Dependency Inversion). Trigger keywords: SOLID, single responsibility, open-closed, liskov substitution, interface segregation, dependency inversion, SRP, OCP, LSP, ISP, DIP, cohesion, coupling, module organization.
---

# SOLID Principles

## Overview

SOLID is five design principles for maintainable, testable, and extensible object-oriented code. Apply them when organizing modules, classes, and functions.

## Single Responsibility Principle (SRP)

> A module/class should have **one reason to change**.

- Each exported function or class should do **one thing**.
- If you cannot describe what a module does in a single sentence without using "and", split it.
- Group **cohesive** behavior together; separate **different concerns** into distinct modules.

```ts
// BAD: one class owns two responsibilities
class InvoiceService {
  calculateTotal(items: Item[]): number { /* ... */ }
  sendEmail(to: string, body: string): void { /* ... */ }
}

// GOOD: separate responsibilities
class InvoiceCalculator {
  calculateTotal(items: Item[]): number { /* ... */ }
}
class EmailSender {
  send(to: string, body: string): void { /* ... */ }
}
```

## Open-Closed Principle (OCP)

> Modules should be **open for extension, closed for modification**.

- Add new behavior by writing new code, not by changing existing tested code.
- Use **strategy pattern**, **polymorphism**, or **function composition** to vary behavior.

```ts
// BAD: adding a new shape requires editing this function
function area(shape: string, ...args: number[]): number {
  if (shape === "circle") return Math.PI * args[0] ** 2;
  if (shape === "rect") return args[0] * args[1];
  throw new Error("unknown shape");
}

// GOOD: open for extension via shape objects
type Shape = { area(): number };
class Circle implements Shape {
  constructor(private r: number) {}
  area(): number { return Math.PI * this.r ** 2; }
}
class Rect implements Shape {
  constructor(private w: number, private h: number) {}
  area(): number { return this.w * this.h; }
}
```

## Liskov Substitution Principle (LSP)

> Subtypes must be substitutable for their base types **without altering correctness**.

- A derived class should **not weaken** preconditions or **strengthen** postconditions of the base.
- If code that works with the base type breaks with a subclass, the design violates LSP.
- Prefer **composition over inheritance** to avoid LSP violations.

```ts
// BAD: Square extends Rect but violates LSP
class Rect {
  constructor(public w: number, public h: number) {}
}
class Square extends Rect {
  constructor(side: number) { super(side, side); }
  set w(v: number) { /* breaks LSP — changing one side changes both */ }
}

// GOOD: separate types
type Rect = { w: number; h: number };
type Square = { side: number };
```

## Interface Segregation Principle (ISP)

> **Many small, specific interfaces** are better than one large, general interface.

- Clients should not depend on methods they don't use.
- Split fat interfaces into smaller role-based interfaces.

```ts
// BAD: all shapes must implement 3d method
interface Shape {
  area(): number;
  volume(): number;
}

// GOOD: segregated by capability
type Planar = { area(): number };
type Solid = Planar & { volume(): number };
```

## Dependency Inversion Principle (DIP)

> Depend on **abstractions**, not concretions. High-level modules should not depend on low-level modules.

- Inject dependencies (e.g. via constructor parameters) rather than instantiating them inside.
- Define interfaces/abstract types for external services so they can be swapped (testing, variants).

```ts
// BAD: high-level code depends on low-level detail
class ReportService {
  private db = new PostgresDatabase();
  generate() { return this.db.query("SELECT ..."); }
}

// GOOD: depend on abstraction
interface Database { query(sql: string): unknown[]; }
class ReportService {
  constructor(private db: Database) {}
  generate() { return this.db.query("SELECT ..."); }
}
```

## Module Organization

- **One module = one responsibility** (SRP). Keep files focused and small (under ~200 lines).
- **Export only what consumers need** — keep internals private.
- **Use function composition** for extensibility (OCP) instead of deep class hierarchies.
- **Inject collaborators** (DIP) rather than importing concrete implementations.
- **Prefer interfaces for external contracts** and types for internal shapes (ISP).
- Group related types, functions, and classes into directories by domain concern, not by role (e.g. `invoicing/` not `models/` + `services/`).
