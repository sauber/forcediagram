---
name: solid-principles
description: Use when designing, organizing, or refactoring code following SOLID principles (Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, Dependency Inversion). Trigger keywords: SOLID, single responsibility, open-closed, liskov substitution, interface segregation, dependency inversion, SRP, OCP, LSP, ISP, DIP, cohesion, coupling, module organization.
---

# SOLID Principles

## SRP — Single Responsibility
One module = one reason to change. If you can't describe it without "and", split it.

## OCP — Open-Closed
Extend behavior with new code (strategy pattern, function composition), not by modifying tested code.

## LSP — Liskov Substitution
Subtypes must be substitutable for their base without altering correctness. Prefer composition over inheritance.

## ISP — Interface Segregation
Many small specific interfaces > one fat interface. Clients shouldn't depend on methods they don't use.

## DIP — Dependency Inversion
Depend on abstractions, not concretions. Inject dependencies (constructor params) rather than instantiating inside.

## Module Organization
- One file = one responsibility, under ~200 lines.
- Export only what consumers need. Function composition over deep class hierarchies.
- Group by domain concern (e.g. `invoicing/`), not by role (`models/` + `services/`).
