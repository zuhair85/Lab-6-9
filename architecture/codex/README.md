# SplitSmart Codex Architecture Proposal

Status: **Draft proposal for human review**, not approved architecture. Baseline: `UserRequirement.md`, `.specify/memory/constitution.md` v1.0.0, and `specs/001-splitsmart-expense-tracker/spec.md` Draft (2026-10-29). No Spec Kit architecture output was inspected. No implementation or tests were run.

## Executive overview

Propose a modular monolith with ports-and-adapters boundaries. Keep presentation replaceable: customer target remains browser-based (RI-010/NFR-006); Java 21/Swing is only a separately labeled academic MVP subset and cannot satisfy RI-010. Keep domain/application logic independent of either UI. Use BigDecimal for every monetary quantity and an auditable ledger with explicit expense approval and payment reconciliation states.

## Scope and assumptions

In scope: accounts/authentication, groups and confirmed membership, expense submission, payer and participant shares, equal/percentage splits, optional receipt, approvals, in-app notifications, balances, payment records, reconciliation, reports, and audit history. Tax/reimbursement treatment is excluded per spec; email/push is deferred. Group approval policy, currency support, receipt retention, partial/overpayment rules, and deployment remain unresolved or proposed choices, not stakeholder-approved.

The creator is payer by default; every participant must be confirmed group member; invalid amounts and percentages not exactly totaling 100% are rejected; shares round to cents with residual assigned to final participant; in-app notices are default. A recorded payment does not change effective balances until separate reconciliation confirms settlement.

## Index

- [Architecture](architecture.md)
- [Domain model](domain-model.md)
- [Data design](data-design.md)
- [Workflows](workflows.md)
- [Interfaces](interfaces.md)
- [Security and quality](security-quality.md)
- [Testing strategy and traceability](testing-strategy.md)
- [Decisions, risks, source defects](decisions-risks.md)
- PlantUML sources: `diagrams/context.puml`, `components.puml`, `domain.puml`, `expense-approval.puml`, `payment-reconciliation.puml`

Human review is mandatory under Constitution Principle V.
