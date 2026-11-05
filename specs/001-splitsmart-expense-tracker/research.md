# Research and Design Decisions

Status: Draft proposal for human review.

## Decision log

### Decision 1: Use a modular monolith with explicit domain/application/infrastructure boundaries.

- Decision: Keep a single codebase with layered architecture and ports/adapters; do not introduce distributed services without explicit scale or deployment requirements.
- Rationale: The product is a shared-expense domain with strong financial rules and user/group/security concerns, but it does not yet require a multi-service deployment. A modular monolith is easier to review, test, and validate under the Constitution while preserving a clear web-target architecture.
- Alternatives considered: full microservice decomposition, a thin CRUD app with business logic in controllers, and a straight desktop-only structure. All were rejected because they would either add unnecessary operational complexity or blur the required separation of UI/domain logic.

### Decision 2: Treat the web application as the primary customer platform and the Swing desktop variant as a clearly labeled academic subset.

- Decision: The web product remains the solution that satisfies RI-010 and NFR-006. The Swing implementation is not the product requirement and is only a separate prototype path.
- Rationale: The Constitution explicitly forbids treating a Swing MVP as fulfilling the web requirement.
- Alternatives considered: merging the desktop and web UI into the same product path, or silently ignoring the difference. Rejected because it would violate the requirement-first approach and the Constitution’s platform distinction.

### Decision 3: Model money using BigDecimal and deterministic split rounding.

- Decision: All amounts, shares, settlements, balances, and reports must use BigDecimal with currency precision and exact arithmetic.
- Rationale: The Constitution requires exact arithmetic for money, and the specification explicitly defines the rounding rule: round each share to the nearest cent, then assign any residual cents to the final participant so totals match the expense amount exactly.
- Alternatives considered: double/float and rounding at the end only. Rejected because they can create rounding drift and violate financial integrity requirements.

### Decision 4: Keep payment history and active balances separate until reconciliation confirms settlement.

- Decision: Recording a payment creates a ledger entry and payment history, but it does not automatically clear the balance. Balance remains active until a separate reconciliation step confirms settlement.
- Rationale: This is the clarified decision in the specification and carries forward as the design default.
- Alternatives considered: immediate balance reduction on payment entry. Rejected because it contradicts the clarified decision and could distort auditability.

### Decision 5: Enforce group membership and approval gates before balance-impacting expenses become effective.

- Decision: Every participant must be a confirmed group member before an expense is accepted; approval is required per configured workflow before the expense can affect balances.
- Rationale: This keeps the system consistent with the clarified requirements and the approval workflow requirement.
- Alternatives considered: allowing any selected user or applying balance changes immediately without review. Rejected because both create access and governance risks.

### Decision 6: Use in-app notifications as the default delivery mechanism.

- Decision: New expenses and approval requests default to in-app notifications, with additional channels reserved for future extension.
- Rationale: The clarifications explicitly resolve this.
- Alternatives considered: email/push as the default. Rejected because they are not the clarified default and would add unnecessary operational complexity.

## Key open issues and source inconsistencies

### Issue 1: Payment semantics conflict between clarification and acceptance criteria.

- Source: `specs/001-splitsmart-expense-tracker/spec.md` — Clarifications / Session 2026-10-29; Acceptance Criteria AC-005.
- Conflict: The clarifications state that a payment is retained in history while the balance remains active until separate reconciliation confirms settlement. A summary statement in AC-005 says “A payment recorded against a balance reduces or clears the outstanding debt as expected,” which can be read as immediate debt reduction.
- Recommendation: This is a specification correction or explicit stakeholder decision. The architecture should align with the clarification until a human reviewer formally changes the rule.

### Issue 2: Open questions still listed despite clarification answers.

- Source: `specs/001-splitsmart-expense-tracker/spec.md` — Open Questions OQ-001 through OQ-004.
- Conflict: Some open questions remain even though the Clarifications section explicitly resolved notification delivery, payment handling, and other topics. This is an example of requirement drift or stale text.
- Recommendation: Treat these as a specification cleanup task. Either close them as resolved by the Clarifications section or confirm a later product decision.

### Issue 3: Traceability summary appears to map FR IDs incorrectly.

- Source: `specs/001-splitsmart-expense-tracker/spec.md` — Requirement Traceability Summary.
- Conflict: The summary maps notifications to FR-008, approvals to FR-009, balances to FR-010, and payments to FR-011, but the functional requirements currently assign those responsibilities to FR-009, FR-010, FR-011, and FR-012 respectively.
- Recommendation: This is a specification correction. The traceability summary should be updated to match the current FR numbering before implementation begins.

### Issue 4: Product platform requirement and Java Swing subset are distinct but must remain explicitly separated.

- Source: `UserRequirement.md` — “OS supported: primary web-based”; `specs/.../spec.md` — Java Swing MVP Subset; `.specify/memory/constitution.md` — SplitSmart Technical Constraints.
- Conflict: The repository already includes a desktop-oriented Java Swing MVP concept, but it must remain a marked subset, not the product requirement.
- Recommendation: Documented design choice; do not treat the Swing subset as satisfying the web requirement.

### Issue 5: Constitution ratification date remains TODO.

- Source: `.specify/memory/constitution.md` — “Version: 1.0.0 | Ratified: TODO(RATIFICATION_DATE)”
- Recommendation: Do not invent or infer a date. This is a governance gap requiring formal approval, not product implementation logic.

## Research questions resolved by the architecture proposal

- What architecture style matches the project scale? A modular monolith with domain/application separation fits the present requirements and reduces complexity.
- What should the default platform be? Browser-based web delivery is the baseline requirement; Swing is only a separate academic subset.
- How should money be handled? Use BigDecimal and deterministic residual-cent allocation.
- How should payments affect balances? Record payment history, keep the balance active until reconciliation confirms settlement; this matches the clarified decision.
- What about notifications? Use in-app notifications as the default, with additional channels as future extension.
- What about non-member participants? The design rejects them at validation time if they are not confirmed members.

## Unresolved or deferred decisions

- Exact approval policy (all expenses vs. selected categories or threshold values).
- Receipt retention policy (database vs. file storage, lifecycle, access rules).
- Database and web framework implementation details are intentionally deferred to implementation planning.
- Currency support beyond a single default currency remains a stakeholder decision.
- Whether to support partial payments, overpayments, or multiple settlement records will require explicit product approval.
