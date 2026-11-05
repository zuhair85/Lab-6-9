# Implementation Plan: SplitSmart Expense Tracker

**Branch**: `001-splitsmart-expense-tracker` | **Date**: 2026-11-05 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-splitsmart-expense-tracker/spec.md`

**Note**: This is a planning artifact for the SplitSmart feature. It is a proposal for human review and does not replace the authoritative customer requirements or the Constitution.

## Summary

SplitSmart is a browser-first shared-expense application for groups and households. The architecture proposal is a modular monolith with domain/application/infrastructure separation and platform-specific adapters so the customer-facing web product remains primary while a separate Java Swing desktop subset remains clearly labeled as an academic prototype only. The design preserves exact-money rules (BigDecimal), confirmed-membership validation, approval gating, payment-history semantics, and auditability across expenses, balances, and reports.

## Technical Context

**Language/Version**: Java 21 (constitutional baseline); implementation and tests to be built with Maven/JUnit 5.

**Primary Dependencies**: Java 21, Maven, JUnit 5; web delivery targeted as the primary product. A web framework and persistence layer are implementation choices and should be selected explicitly during implementation. A Java Swing UI may be kept as an academic subset but must remain outside the defined web product path.

**Storage**: Relational data store is the intended production strategy (proposed: PostgreSQL or equivalent RDBMS); receipt files should be stored through a storage abstraction rather than embedded directly in the domain model.

**Testing**: JUnit 5 for unit, integration, and persistence validation; Maven as the required build runner; acceptance-level workflow tests trace to FR/AC IDs.

**Target Platform**: Primary target is web-based delivery; Swing is a separate academic prototype with explicit labeling and no claim to satisfy RI-010/NFR-006.

**Project Type**: Web application with a modular monolith architecture and optional platform adapters for desktop demonstration.

**Performance Goals**: Support multi-user shared groups and recurring expense tracking with stable balance computation for normal household or team sizes; no explicit production scale requirement is yet defined beyond standard group use and auditable reporting.

**Constraints**: Exact decimal arithmetic for all money, explicit approval and membership rules, access isolation by group, immutable audit trail, and human verification before financial actions are accepted.

**Scale/Scope**: Small to mid-sized shared-expense groups; no distributed or multi-service infrastructure required unless a later approved change adds explicit scale or deployment constraints.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Pass with explicit cautions:

- Requirement-first and traceable delivery: The architecture is grounded in RI-001 through RI-010, FR-001 through FR-017, and the clarified decisions in the spec. This proposal does not replace the source requirements.
- Separation of concerns: Presentation is separate from application logic, domain rules, and persistence/adapters. This keeps Swing UI and web UI as platform-specific adapters rather than business rules.
- Financial integrity: All monetary flows use BigDecimal and explicit rounding policy. This design preserves the clarified rule: round each share to cents, then assign remaining residual cents to the final participant.
- Test-first and verifiable quality: Maven and JUnit 5 are required; the proposal identifies unit, integration, persistence, and workflow verification areas, mapped to FR and AC IDs.
- Human review: This plan is a proposal only and requires stakeholder review before approval. AI-generated decisions remain subject to human confirmation.
- Web-vs-MVP distinction: The web product remains the primary requirement; Java Swing is explicitly treated as an academic subset and is not merged into the platform requirement.
- Governance gap: The Constitution’s ratification date remains TODO and is not inventively filled in this plan.

## Project Structure

### Documentation (this feature)

```text
specs/001-splitsmart-expense-tracker/
├── plan.md              # architecture plan (this file)
├── research.md          # decisions, risks, source inconsistencies, unresolved questions
├── data-model.md        # entities, invariants, lifecycle, and monetary rules
├── quickstart.md        # validation guide for reviewers / future implementers
├── contracts/           # conceptual interface contracts and service boundaries
├── diagrams/            # PlantUML source for key architecture views
├── spec.md              # clarified customer requirement source of truth
└── tasks.md             # to be generated later by /speckit-tasks (not created in this pass)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── domain/
│   │   ├── model/
│   │   ├── services/
│   │   ├── validation/
│   │   └── policy/
│   ├── application/
│   │   ├── usecases/
│   │   ├── ports/
│   │   └── commands/
│   ├── infrastructure/
│   │   ├── persistence/
│   │   ├── security/
│   │   ├── notifications/
│   │   ├── receipts/
│   │   └── reporting/
│   ├── web/
│   │   ├── controllers/
│   │   ├── dto/
│   │   └── auth/
│   └── shared/
│       └── money/
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── persistence/
│   └── authorization/
└── pom.xml

desktop/
├── src/
│   ├── ui/
│   ├── presenters/
│   └── adapters/
└── pom.xml
```

**Structure Decision**: A single shared domain/application core is used for the web product, with adapters for web UI and an explicitly labeled Swing academic subset. The domain and application layers are shared; no requirement is allowed to infer that the Swing package is the real customer platform.

## Architecture decisions and rationale

1. Modular monolith with ports-and-adapters boundaries.
   - Rationale: The project is a small-to-medium business domain with shared rules, but no requirement demonstrates a need for distributed services. The domain logic is richer than a simple CRUD app and needs explicit approval, balances, and reporting rules.
   - Benefits: Clear dependency direction, easier human review, easier JUnit 5 testing, and straightforward persistence and ledger management.

2. Primary web platform, desktop adapter only as academic subset.
   - Rationale: RI-010 and NFR-006 explicitly state the web-based platform is primary. The Swing MVP is an implementation choice, not a valid substitute.
   - Architectural boundary: `web/` and `desktop/` live behind shared application/domain services without allowing UI code to own business rules.

3. Domain-first ledger and approval semantics.
   - Rationale: Expense creation, balance calculations, and payments require auditability, not just CRUD updates. The domain model should distinguish between recorded payment, pending obligations, and reconciled settlement.

4. Exact money and deterministic split calculation.
   - Rationale: Monetary rules are explicit in the Constitution and specification; all money arithmetic must be exact and repeatable.

5. Authorization and group membership are enforced at the domain boundary.
   - Rationale: Expense participation depends on confirmed group membership, and FR-015 requires explicit unauthorized access prevention.

## Traceability and status

- RI-001 / RI-010 / NFR-006 -> web product requirement and platform boundary.
- RI-003 / RI-004 / FR-004 / FR-005 / FR-006 / FR-007 -> expense creation and split logic.
- RI-005 / FR-009 -> notifications.
- RI-006 / FR-010 -> approval workflow.
- RI-007 / FR-011 -> balances.
- RI-008 / FR-012 -> payment, ledger, and reconciliation semantics.
- RI-009 / FR-013 / FR-014 -> reporting.
- FR-016 / FR-017 -> auditability and implementation-choice separation.

## Complexity Tracking

No constitutional violations require exception. The only explicit governance issue is the still-open ratification date in the Constitution; this is documented as an unresolved governance item rather than a product requirement.

## Spec Kit Architecture Self-Review

Strengths:
- The design preserves the source requirements and clearly distinguishes the web target from the Java Swing academic subset.
- The domain model keeps financial rules in a single, auditable service layer using BigDecimal and explicit approval/payment semantics.
- The architecture supports validation with Maven and JUnit 5, while keeping UI thin and replaceable.

Weaknesses / open decisions:
- Final database choice, auth provider, and receipt storage technology are intentionally left as implementation choices because the repository does not yet declare them.
- Approval policy details (who reviews, threshold values, and whether all expenses require approval) remain stakeholder decisions.
- Payment semantics for partial payments and settlement histories require explicit product confirmation before final implementation.

Source inconsistencies identified:
- The specification’s clarification says a payment record keeps the balance active until reconciliation, but some acceptance criteria and wording imply immediate debt reduction. This requires a specification correction or explicit stakeholder decision.
- The traceability summary contains mismatched FR IDs and appears to map notifications, approvals, balance, and payments to the wrong numbers.
- Some open questions remain unresolved despite clarifications deciding notifications and payment behavior; those should be formally closed or converted into explicit design decisions.
- The Constitution still has a TODO ratification date and should not be filled in arbitrarily.

Files created or changed:
- [plan.md](./plan.md)
- [research.md](./research.md)
- [data-model.md](./data-model.md)
- [quickstart.md](./quickstart.md)
- [contracts/expense-service.md](./contracts/expense-service.md)
- [diagrams/layers.puml](./diagrams/layers.puml)
- [diagrams/domain-model.puml](./diagrams/domain-model.puml)
- [diagrams/approval-flow.puml](./diagrams/approval-flow.puml)
