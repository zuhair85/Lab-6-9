# Decisions, risks, and source defects

All entries are proposals, not approved decisions. Confidence describes design confidence, not stakeholder acceptance.

## Decision log

| Proposal | Rationale / alternatives / consequence | Confidence / approval |
|---|---|---|
| Modular monolith, ports/adapters | Simple consistency and replaceable UI; alternative microservices adds operational complexity. | High; architecture review required |
| Domain/application independent of UI | Supports web target and Swing subset without conflating them. | High; human approval required |
| Relational persistence | Constraints, audit joins and transactions; alternative document store has weaker relational integrity. | Medium; confirm technical constraints |
| Immutable share snapshots and compensating events | Preserves financial audit; alternative mutable rows obscures prior state. | High; approve domain semantics |
| Explicit payment reconciliation gate | Follows clarification; alternative immediate payment settlement contradicts it. | High against current clarification; spec correction required |
| In-app notification records | Matches clarification; additional channels deferred. | High; stale OQ needs closure |
| Currency-aware precision; HALF_UP example | Exact arithmetic and residual rule; currency/rounding standard absent. | Medium; stakeholder decision on currency/rounding |
| Private receipt reference | Limits exposure; blob vs private object store alternative. | Medium; approve storage/retention before production |
| Transactional outbox/idempotency/versioning | Retry/concurrency safety; simpler synchronous alternatives risk partial state. | Medium; implementation design review |

## Source defects and required action

1. **Payment semantics conflict:** clarification in `specs/001-splitsmart-expense-tracker/spec.md`, Clarifications, payment question says retain active balance until separate reconciliation. FR-012 says update balances after payment entry; AC-005 says recorded payment reduces/clears debt. Action: specification correction to distinguish recorded, pending and reconciled; stakeholder decision required only for allocation/confirmation details. Architecture uses clarification as current rule, not unilateral product change.
2. **Stale open questions:** spec Clarifications resolve OQ-001 (in-app default), partly address OQ-004 (history and reconciliation, but partial/multiple history details remain), and set creator payer, confirmed membership, rounding, invalid split behavior. OQ-002 (approval policy) and OQ-003 (receipt MVP) remain genuinely open. Action: close resolved questions in spec and narrow OQ-004; stakeholder decision for OQ-002/OQ-003 and payment edge policy.
3. **Traceability summary ID drift:** spec `Requirement Traceability Summary` maps Notifications to FR-008 (receipt; actual notification FR-009); Approval to FR-009 (notification; actual FR-010); Balance to FR-010 (approval; actual FR-011); Payment to FR-011 (balance; actual payment FR-012); Reporting to FR-012 (payment; actual reporting FR-013/014); Implementation separation says FR-016 (audit; actual FR-017). It also omits several requirement IDs. Action: specification correction; no stakeholder product decision needed.
4. **Web vs Swing boundary:** spec Requirements Inventory RI-010 and NFR-006 require web; Java Swing MVP subset explicitly excludes web coverage. Constitution technical constraints repeat this boundary. Action: document design choice and verify every deliverable labels Swing as subset; stakeholder approval required only to change platform requirement.
5. **Ratification TODO:** `.specify/memory/constitution.md`, Governance and sync-impact header, keep `TODO(RATIFICATION_DATE)`; do not invent date. Action: project owner supplies actual date if governance record is to be completed.
6. **Approval gate ambiguity:** spec AC-003 says expense save updates balances, while AC-008 and FR-010 require approval before balance effects. Action: specification correction must define approval-required groups/states and acceptance behavior; stakeholder decision on policy.
7. **Payer/share semantics:** FR-007 allows alternate payer explicitly; clarification only says creator default. No rule covers payer excluded from participants. Action: stakeholder decision / spec clarification; do not infer.
8. **Money/currency and settlement edge cases:** currency precision, rounding mode beyond residual cents, partial payments, overpayments, payment evidence and date-range boundaries are not resolved. Action: explicit stakeholder decisions where behavior affects obligations; document technical currency metadata as a design choice after policy.

## Risk register

| Risk | Impact | Mitigation / owner decision |
|---|---|---|
| Misinterpreted payment recording | Incorrect balances and trust loss | Distinct pending/reconciled status; correct spec/tests |
| Approval policy unclear | Expense effective at wrong time | Define group policy and acceptance before implementation |
| Currency/rounding mismatch | Cent discrepancies | Choose supported currencies/precision and test residuals |
| Concurrent reconciliation | Duplicate/over allocation | Transaction locks/versioning/idempotency; integration tests |
| Receipt leakage or malware | Privacy/security incident | Private storage, content validation, retention decision |
| Swing mistaken for web product | Customer requirement unfulfilled | Label subset everywhere; keep web target visible |
| Inaccurate traceability | Requirements dropped or misclassified | Correct summary; review full matrix |
| TODO ratification date | Governance ambiguity | Obtain date from owner; never fabricate |

Deferred: external notification channels, production hosting/deployment, banking integrations, tax treatment, advanced custom reporting, and scale/availability targets.
