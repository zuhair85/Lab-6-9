# Architecture

## Context, boundary, actors

Actors are account holders (expense creators/payers, participants, reviewers, group administrators) and human reviewers. The system owns profiles, groups, membership, expenses, approvals, notifications, obligations, payment evidence, reconciliation, reports, and audit history. Browser users are the product target. Swing is an academic MVP delivery adapter only. External email/push, banking, identity providers, cloud storage, and production hosting are not assumed or mandated.

Customer needs RI-001..RI-010 are distinct from choices such as Java 21, Maven, Swing, and relational persistence. The web target needs web presentation/API and deployment decisions later; Swing can reuse domain/application modules but does not fulfill RI-010/NFR-006.

## Style and dependencies

Recommend a modular monolith with ports and adapters. It minimizes deployment and consistency complexity while preserving a future web interface. No microservices are proposed.

```text
Web UI (target) / Swing UI (academic subset)
                  ↓
       Application use cases (commands/queries)
                  ↓
        Domain model (rules/value objects)
                  ↑
Infrastructure adapters implement ports:
relational repository, password hasher, clock, receipt store, notification delivery
```

Dependencies point inward: adapters and UI depend on application/domain contracts; domain depends on neither framework nor persistence. Application orchestrates transactions and authorization, domain enforces invariants, adapters implement storage/security/delivery. UI must not calculate shares or balances.

## Modules

- `identity`: accounts, login boundary, password-hash port.
- `groups`: groups, membership, invitation/addition and role checks.
- `expenses`: submission, immutable share snapshot, receipt metadata, approval.
- `ledger`: obligation derivation, balance projection, payments, reconciliation, audit.
- `notifications`: in-app records and delivery port.
- `reporting`: read-only date/group scoped summaries.
- `application`: use-case orchestration, validation, authorization, transactions.
- `persistence`: relational repositories and transactions; replaceable adapter.
- `presentation-web`: future browser delivery.
- `presentation-swing`: optional academic subset, explicitly labeled.

Currency is unspecified. A one-currency-per-group rule would need stakeholder approval. Approval policy, receipt storage and their consequences are in `decisions-risks.md`.
