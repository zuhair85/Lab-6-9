# SplitSmart Architecture Comparison and Cross-Check

**Review date:** 2026-11-05  
**Repository:** `zuhair85/Lab-6-9`  
**Branch inspected:** `main`  
**Review status:** **Needs revision**

## 1. Executive summary

The Spec Kit and Codex architecture proposals are both useful and technically feasible. They independently converge on a modular monolith with clear presentation, application, domain, and infrastructure boundaries; relational persistence; exact monetary arithmetic; and explicit expense approval and payment-reconciliation lifecycles.

**Recommendation:** Use the Codex proposal as the stronger technical foundation, incorporate Spec Kit's clearer feature-level domain and reviewer documentation, correct the source specification, and then prepare a consolidated architecture for human approval.

The principal approval blockers are source-specification inconsistencies:

1. Payment recording is described as retaining an active balance until separate reconciliation, while FR-012 and AC-005 wording can imply immediate balance reduction.
2. Expense-save and approval-related wording does not consistently define when an expense becomes balance-effective.
3. The Requirement Traceability Summary contains stale or incorrect FR-ID mappings.

Other important decisions remain open, including approval policy, payer participation, currency precision, and partial/overpayment behavior.

This review did not modify repository files or approve either proposal. AI-generated architecture remains subject to human review.

## 2. Sources and revisions inspected

The following files were retrieved from `main`:

### Baseline

- `UserRequirement.md`
- `.specify/memory/constitution.md`
- `specs/001-splitsmart-expense-tracker/spec.md`

### Spec Kit proposal

- `specs/001-splitsmart-expense-tracker/plan.md`
- `specs/001-splitsmart-expense-tracker/research.md`
- `specs/001-splitsmart-expense-tracker/data-model.md`
- `specs/001-splitsmart-expense-tracker/contracts/expense-service.md`
- `specs/001-splitsmart-expense-tracker/quickstart.md`
- `specs/001-splitsmart-expense-tracker/diagrams/layers.puml`
- `specs/001-splitsmart-expense-tracker/diagrams/domain-model.puml`
- `specs/001-splitsmart-expense-tracker/diagrams/approval-flow.puml`

### Codex proposal

- `architecture/codex/README.md`
- `architecture/codex/architecture.md`
- `architecture/codex/domain-model.md`
- `architecture/codex/data-design.md`
- `architecture/codex/workflows.md`
- `architecture/codex/interfaces.md`
- `architecture/codex/security-quality.md`
- `architecture/codex/testing-strategy.md`
- `architecture/codex/decisions-risks.md`
- `architecture/codex/diagrams/context.puml`
- `architecture/codex/diagrams/components.puml`
- `architecture/codex/diagrams/domain.puml`
- `architecture/codex/diagrams/expense-approval.puml`
- `architecture/codex/diagrams/payment-reconciliation.puml`

Both proposal sets were present and sufficiently complete for comparison. The Spec Kit plan is dated 2026-11-05; the Codex README identifies Constitution v1.0.0 and a specification draft dated 2026-10-29. Neither proposal records a complete baseline revision manifest or source hashes from its generation time. Therefore, exact byte-for-byte baseline equivalence and absence of all cross-agent contamination cannot be independently proven retrospectively. Codex's README states that it did not inspect the Spec Kit architecture output, but that statement is not independent proof.

## 3. Side-by-side comparison

| Topic | Spec Kit | Codex | Assessment |
|---|---|---|---|
| Architecture style | Layered modular monolith | Modular monolith with ports/adapters | Equivalent direction |
| Domain/application separation | Explicit domain, application, infrastructure | Explicit inward dependency direction and use cases | Equivalent; Codex explains boundaries more thoroughly |
| Platform | Web primary; Swing academic subset | Web primary; Swing academic subset | Equivalent and constitution-aligned |
| Domain model | Users, groups, memberships, expenses, splits, approvals, payments, reconciliation | Similar model plus obligations, allocations, and versions | Complementary; Codex more detailed |
| Persistence | Relational strategy; physical choice deferred | Logical relational schema, keys, indexes, constraints | Codex stronger |
| Expense workflow | Submission, optional approval, balance activation | Submission, versioned review, atomic obligation activation | Codex stronger |
| Financial arithmetic | BigDecimal and residual-cent allocation | BigDecimal, decimal-string boundaries, currency-aware precision, stable ordering | Equivalent core; Codex adds useful detail |
| Payment workflow | Separate recording and reconciliation concepts | Pending confirmation, allocation, reconciliation, dispute/void proposals | Codex stronger |
| Balances | Derived from expense/payment history | Rebuildable obligation projection | Complementary |
| Interfaces | Conceptual service request/response examples | Commands and queries with actor/version/idempotency context | Complementary |
| Security | Membership and access rules | More explicit group isolation, private receipts, password hashing, audit minimization | Codex stronger |
| Testing | Reviewer scenarios and Maven examples | Unit, integration, authorization, workflow, concurrency, traceability | Codex stronger |
| Traceability | Partial mappings across plan and quickstart | Explicit requirement-ID matrix | Codex stronger |
| Diagrams | Layer, domain, approval flow | Context, components, domain, approval, payment reconciliation | Complementary |
| Decision records | Research decisions and unresolved issues | Decision log, risks, owner decisions, source defects | Codex stronger |

### Material observations

**Persistence:** Spec Kit identifies relational persistence but leaves more of the schema for later. Codex defines users, groups, memberships, expenses, shares, receipts, approvals, notifications, payments, obligations, allocations, and audit events. Use Codex's logical schema as a starting point, not as an already-approved physical schema.

**Financial ledger:** Codex's obligation/allocation model is more explicit and better supports avoiding double counting and reconstructing balances. Combine it with Spec Kit's readable domain entity descriptions and examples.

**Diagrams:** Spec Kit's `layers.puml` is useful for explaining the basic separation of concerns, but its infrastructure-to-application relationships are visually ambiguous relative to the dependency-inversion narrative. Codex's context and component diagrams improve system-boundary communication; clarify that infrastructure adapters implement ports defined inward rather than simply depending on use cases.

**Approval and payment states:** Both proposals separate approval from payment settlement. Codex supplies more explicit transaction and version-handling details. Approval semantics still require a product decision.

## 4. Requirements cross-check

Legend: **Good** means a concrete design element and plausible verification approach are present. **Partial** means coverage exists but important behavior or tests remain underspecified. **Gap** means no sufficiently concrete coverage or a source contradiction prevents reliable approval. These are review judgments, not automated test results.

### 4.1 Customer requirement inventory

| ID | Spec Kit | Codex | Finding |
|---|---|---|---|
| RI-001 | Good | Good | Accounts and authentication |
| RI-002 | Good | Good | Group and membership lifecycle |
| RI-003 | Good | Good | Expense details and optional receipt |
| RI-004 | Good | Good | Participants and share snapshots |
| RI-005 | Good | Good | In-app notification design |
| RI-006 | Partial | Good | Approval policy remains unresolved |
| RI-007 | Good | Good | Balance/obligation calculations |
| RI-008 | Partial | Partial | Reconciliation modeled; payment edge policies remain open |
| RI-009 | Partial | Good | Reporting design and verification |
| RI-010 | Good | Good | Web target explicitly preserved |

### 4.2 Functional requirements

| ID | Spec Kit | Codex | Finding |
|---|---|---|---|
| FR-001 | Good | Good | Account creation and authentication |
| FR-002 | Good | Good | Group management |
| FR-003 | Good | Good | Membership lifecycle |
| FR-004 | Good | Good | Expense submission |
| FR-005 | Good | Good | Equal and percentage splits |
| FR-006 | Good | Good | Percentage validation |
| FR-007 | Partial | Partial | Creator default covered; alternate payer semantics unresolved |
| FR-008 | Partial | Good | Receipt storage/access policy needs finalization |
| FR-009 | Good | Good | Notification events |
| FR-010 | Partial | Partial | Approval policy and reviewer authorization need decisions |
| FR-011 | Good | Good | Pairwise balances |
| FR-012 | Gap | Partial | Source requirement conflicts with clarified payment behavior |
| FR-013 | Partial | Good | Reporting totals and scope |
| FR-014 | Partial | Good | Date filtering; boundary policy unresolved |
| FR-015 | Partial | Good | Authorization needs concrete role and isolation rules |
| FR-016 | Partial | Good | Audit history and reconstruction |
| FR-017 | Good | Good | Requirement/implementation-choice distinction |

### 4.3 Non-functional requirements

| ID | Spec Kit | Codex | Finding |
|---|---|---|---|
| NFR-001 | Good | Good | Deterministic financial behavior |
| NFR-002 | Good | Good | BigDecimal and exact arithmetic |
| NFR-003 | Partial | Good | Codex provides more concrete security controls |
| NFR-004 | Partial | Partial | Understandability is acknowledged, not measured |
| NFR-005 | Partial | Good | Codex proposes transactions, versions, and concurrency tests |
| NFR-006 | Good | Good | Browser-first target |
| NFR-007 | Good | Good | Human review is explicit |

### 4.4 Acceptance criteria

| ID | Spec Kit | Codex | Finding |
|---|---|---|---|
| AC-001 | Good | Good | Account isolation |
| AC-002 | Good | Good | Group creation and members |
| AC-003 | Gap | Partial | Balance update timing conflicts with approval gate |
| AC-004 | Good | Good | Invalid percentage rejection |
| AC-005 | Gap | Partial | Immediate balance reduction conflicts with clarification |
| AC-006 | Partial | Good | Date-range report |
| AC-007 | Good | Good | Notification delivery |
| AC-008 | Partial | Good | Approval state and balance effect |
| AC-009 | Good | Good | Who-owes-whom display |
| AC-010 | Good | Good | Platform and implementation distinction |

### 4.5 Success criteria

| ID | Spec Kit | Codex | Finding |
|---|---|---|---|
| SC-001 | Partial | Partial | Five-minute onboarding needs a test protocol |
| SC-002 | Good | Good | Correct expense share and balance |
| SC-003 | Partial | Partial | 95% threshold lacks defined denominator and dataset |
| SC-004 | Partial | Good | Report validation more explicit in Codex |
| SC-005 | Good | Good | Human review and traceability |

Codex has better traceability and verification planning. However, a traceability matrix does not resolve a contradictory source requirement; it can only expose where the contradiction affects the design.

## 5. Constitution compliance

| Constitutional requirement | Spec Kit | Codex | Review |
|---|---|---|---|
| Customer requirements authoritative | Compliant | Compliant | Both distinguish requirements from engineering choices |
| Traceability | Partial | Strong | Codex matrix is more complete |
| Object-oriented design | Compliant | Compliant | Both propose domain objects and explicit responsibilities |
| UI/domain separation | Compliant | Compliant | UI kept outside business rules |
| Java 21 | Compliant | Compliant | Retained as technical baseline |
| Maven | Compliant | Compliant | Required; no build project exists yet |
| JUnit 5 | Compliant | Compliant | Required; no tests were run |
| BigDecimal for money | Compliant | Compliant | Both explicitly prohibit floating-point money |
| Test-first quality | Partial | Partial | Strategies described; no executed implementation evidence |
| PlantUML | Compliant | Compliant | Both supply useful source diagrams |
| Human review | Compliant | Compliant | Proposals remain unapproved |
| Web product versus Swing MVP | Compliant | Compliant | Correctly distinguished |
| Constitution ratification date | Compliant | Compliant | TODO left untouched |

No major constitutional violation was identified in either proposal. Architecture documentation does not itself prove test-first compliance; this must be demonstrated during implementation.

## 6. Financial correctness review

**Approval blocker until semantics are clarified.**

### What both proposals get right

- The expense creator is the default payer.
- Participants must be confirmed group members.
- Equal and percentage splits use exact decimal arithmetic.
- Shares must total exactly the expense amount.
- Residual cents are assigned to the final participant.
- Invalid amounts and percentage totals are rejected.
- Approval controls whether an expense affects balances.
- Recording a payment is separate from confirming settlement.
- Financial history should be retained and reconstructable.

### Findings

**A. Approval timing**

Spec Kit's approval-flow diagram allows expenses to become effective without approval when group policy does not require it. Codex also leaves approval policy open. This may be a valid design, but the specification must say whether approval is always required or configured per group.

AC-003 suggests saving an expense updates balances, while FR-010 and AC-008 introduce approval before balance effect in approved groups. These statements need a consistent lifecycle.

**B. Payment recording versus reconciliation**

The clarification says balances remain active until separate reconciliation confirms settlement. FR-012 and AC-005 can imply that entering a payment immediately updates balances. Codex's pending/reconciled approach is safer, but the source specification must be corrected.

**C. Payer excluded from participants**

Neither proposal fully resolves what happens if the payer is not among the participants. For example, if the payer pays $120 for three other members, does the payer receive no share, or is their own share implicitly included? This needs an explicit product rule.

**D. Currency and rounding**

Both proposals use BigDecimal, but currency precision and rounding mode are not fully settled. Codex's `HALF_UP` is a proposal, not an already-approved specification decision. Decide supported currencies and precision rules explicitly.

**E. Partial payments, overpayments, and reversals**

Codex identifies these as unresolved. Its payment allocations are a useful foundation, but behavior needs stakeholder approval. The implementation must not silently clamp an overpayment, create an unexplained negative obligation, or lose correction history.

**F. Transaction safety**

Codex is stronger here. Retain atomic expense submission, version checks during approval, locking during reconciliation, idempotent retries, rebuildable balance projections, and append-only audit history. These safeguards help prevent duplicate allocations, race conditions, and inconsistent balances.

## 7. Security and privacy review

Codex provides the more complete security design.

| Area | Finding | Recommendation |
|---|---|---|
| Authentication | Both propose secure credential handling | Retain salted adaptive password hashing |
| Authorization | Codex explicitly scopes use cases | Enforce group-scoped authorization at application and persistence boundaries |
| Group isolation | Codex proposes cross-group access tests | Add negative tests for all sensitive resources |
| Membership enforcement | Both require confirmed membership | Enforce transactionally during expense submission |
| Receipt access | Codex proposes private storage and validation | Add authorization, file limits, content validation, and retention policy |
| Audit history | Codex recommends append-only events and minimized payloads | Retain; avoid unnecessary sensitive data |
| Session security | Not fully designed | Specify secure session handling and account recovery |
| Threat modeling | Codex explicitly defers it | Complete before production deployment |

Additional security concerns for detailed design include session expiration/revocation, login rate limiting, account recovery abuse, CSRF protection for cookie-based sessions, encryption and backup protection, invitation abuse, receipt malware scanning/safe serving, and audit retention/deletion.

These concerns do not require abandoning the modular monolith; they require a production-ready security design.

## 8. Source specification defects and recommended corrections

These are source-specification defects, not merely proposal weaknesses.

| Priority | Source | Problem | Recommended action |
|---|---|---|---|
| Critical | `spec.md`, Clarifications; FR-012; AC-005 | Payment recording versus reconciliation conflict | Correct specification |
| Critical | `spec.md`, AC-003; FR-010; AC-008 | Expense save versus approval timing conflict | Clarify lifecycle and policy |
| High | `spec.md`, Requirement Traceability Summary | FR mappings are stale | Correct FR-ID references |
| High | `spec.md`, Open Questions OQ-001–OQ-004 | Resolved questions remain open or too broad | Close resolved questions and narrow unresolved ones |
| High | `spec.md`, FR-007 and Clarifications | Alternate payer and payer-not-participant behavior unclear | Obtain stakeholder decision |
| Medium | `spec.md`, SC-001 and SC-003 | Measurement methods and test denominator undefined | Define measurable validation protocols |
| Medium | `spec.md`, OQ-004 | Partial payments and multiple settlements unresolved | Obtain stakeholder decision |
| Governance | `constitution.md`, Governance | Ratification date remains TODO | Project owner supplies actual date |

### 8.1 Traceability summary corrections

The current Requirement Traceability Summary contains mappings that do not match the Functional Requirements section:

| Feature | Current mapping problem | Correct FR mapping |
|---|---|---|
| Notifications | FR-008 points to receipts | FR-009 |
| Approval | FR-009 points to notifications | FR-010 |
| Balance tracking | FR-010 points to approval | FR-011 |
| Payment tracking | FR-011 points to balances | FR-012 |
| Reporting | FR-012 points to payments | FR-013 and FR-014 |
| Implementation-choice separation | FR-016 points to audit history | FR-017 |

The summary also omits some relevant requirement IDs. Correct the summary without changing the underlying requirements.

### 8.2 Open Questions

- **OQ-001:** In-app notifications are already selected as the default. Close the question or revise it to ask only about optional future channels.
- **OQ-002:** Approval policy remains genuinely unresolved.
- **OQ-003:** Receipt inclusion in the mandatory MVP remains unresolved.
- **OQ-004:** Payment history and separate reconciliation are clarified, but partial payments and multiple settlement records remain unresolved. Narrow the question accordingly.

Leave `TODO(RATIFICATION_DATE)` in the Constitution untouched until the project owner confirms the actual date.

## 9. Material disagreements and omissions

| Issue | Classification | Recommended resolution |
|---|---|---|
| Modular monolith versus ports/adapters terminology | Equivalent | Use a modular monolith with ports/adapters boundaries |
| Payment recording versus settlement | Source contradiction | Correct specification before implementation |
| Approval-required versus approval-optional expenses | Material unresolved policy | Project owner decides |
| Payment allocation schema | Complementary detail | Retain Codex allocation model |
| Receipt storage | Omission/undecided choice | Define privacy and retention before production |
| Currency precision | Material unresolved policy | Approve currency and rounding rules |
| Alternate payer | Material unresolved behavior | Clarify payer/participant relationship |
| Concurrency and retries | Codex improvement | Retain locking, versioning, idempotency |
| Audit and correction model | Complementary | Use append-only history and controlled compensating events |
| Web/Swing boundary | Equivalent | Preserve requirement distinction |

## 10. Best ideas to retain

### From Spec Kit

1. Clear feature-level architecture plan.
2. Readable domain entity definitions and invariants.
3. Conceptual service contract examples.
4. Reviewer-oriented quickstart scenarios.
5. Simple layer and approval-flow diagrams.
6. Explicit statement that artifacts are proposals, not approved architecture.

### From Codex

1. Logical relational schema.
2. Obligation and payment-allocation model.
3. Transactional expense submission and reconciliation.
4. Version checks, locking, and idempotency.
5. More complete application interface definitions.
6. Group-scoped security and private receipt storage.
7. Detailed requirement-to-verification matrix.
8. Decision log and risk register.
9. Separate payment-reconciliation diagram.

## 11. Recommended consolidated architecture

**Recommended direction:** A modular monolith with a shared domain/application core and replaceable presentation adapters. Use Codex's stronger transaction and persistence design, supplemented by Spec Kit's clearer feature documentation.

### Logical structure

1. **Presentation layer**
   - Browser-based web application — primary customer product.
   - Java Swing — separate academic subset only; must not be represented as satisfying the web requirement.

2. **Application layer**
   - Account and group use cases.
   - Expense submission and approval.
   - Payments and reconciliation.
   - Balances and reporting.

3. **Domain layer**
   - Users and memberships.
   - Expenses and shares.
   - Obligations and ledger rules.
   - Payment lifecycle.
   - Audit events.
   - BigDecimal and financial invariants.

4. **Infrastructure adapters**
   - Relational persistence.
   - Authentication.
   - Receipt storage.
   - In-app notifications.
   - Audit persistence.

### Recommended design decisions

| Element | Source | Recommendation |
|---|---|---|
| Modular monolith | Both | Retain |
| Domain/application separation | Both | Retain |
| Web-first presentation | Both and customer requirement | Mandatory |
| Swing academic subset | Both and Constitution | Keep separate and explicitly labeled |
| Relational logical schema | Codex | Use as starting point |
| Expense/share model | Spec Kit | Retain and refine |
| Obligation projection | Codex | Retain |
| BigDecimal and residual cents | Both | Mandatory |
| Approval lifecycle | Both | Retain after specification correction |
| Payment reconciliation | Both; Codex detail | Retain as separate confirmation |
| Transactions, versioning, idempotency | Codex | Retain |
| Security and audit model | Codex | Retain and expand |
| JUnit 5 test strategy | Both | Require test-first implementation |
| PlantUML diagrams | Both | Consolidate and keep synchronized |

A modular monolith is proportionate at this stage. Microservices, distributed messaging infrastructure, and complex deployment are not justified without specific scale or operational requirements.

## 12. Proposal scores

Scores are review judgments from 1–5, not objective measurements.

| Evaluation category | Spec Kit | Codex |
|---|---:|---:|
| Requirement coverage and traceability | 3 | 4 |
| Constitution compliance | 4 | 4 |
| Domain and financial correctness | 3 | 4 |
| Architecture quality | 4 | 4 |
| Data integrity and persistence | 3 | 5 |
| Security and privacy | 3 | 4 |
| Testability and verification | 3 | 5 |
| Diagram accuracy and usefulness | 4 | 4 |
| Clarity and reviewability | 4 | 4 |
| Feasibility and proportionality | 5 | 5 |
| **Overall assessment** | **3.6 / 5** | **4.3 / 5** |

Codex scores higher because of its more complete persistence, transaction, security, and traceability design. It does not win simply because it is longer or more detailed.

Neither proposal earns approval yet: financial and approval-related specification conflicts outweigh the scoring difference.

## 13. Prioritized remediation

### Critical — before architecture approval

1. Resolve payment recording versus reconciliation contradiction.
2. Resolve expense-save versus approval-effect contradiction.
3. Define how obligations are calculated when the payer is excluded from participants.

### High — before implementation planning

4. Correct the Requirement Traceability Summary.
5. Close or narrow stale Open Questions.
6. Define approval policy and reviewer authorization rules.
7. Define partial payment, overpayment, dispute, reversal, and correction behavior.
8. Define currency support and precision policy.
9. Strengthen security design and group-isolation verification.

### Medium

10. Define date-range boundary behavior.
11. Define receipt storage, access, and retention.
12. Specify validation protocols for SC-001 and SC-003.
13. Consolidate PlantUML diagrams and ensure dependency direction is accurate.

### Low

14. Standardize terminology across the proposals.
15. Document approved design decisions and rejected alternatives in a single architecture decision record set.

## 14. Decisions required from the project owner

These decisions should be made before implementation planning proceeds.

1. **Approval policy:** Should every expense require approval, or should groups configure approval rules?
2. **Payment confirmation:** Who is authorized to reconcile a payment: the recipient, a group administrator, or either?
3. **Payer participation:** Can the payer be excluded from participants, and how should shares be calculated then?
4. **Alternate payer:** Should users be allowed to select a payer other than the expense creator?
5. **Partial payments:** Should a payment be allocatable across multiple obligations or confirmed in portions?
6. **Overpayments:** Should overpayments be rejected, retained as credit, or handled through another explicit workflow?
7. **Currencies:** Which currencies must be supported, and what precision policy applies?
8. **Receipts:** Are receipt images mandatory for the MVP, and what retention policy applies?
9. **Web scope:** Is the web product part of the required deliverable, or is current Swing work strictly an academic subset?

The Constitution ratification date is a separate governance matter and must be supplied by the project owner, not inferred.

## 15. Final readiness verdict

**NEEDS REVISION**

Both architecture proposals are valuable and technically feasible, but neither is ready for final human approval until the financial lifecycle and approval-policy conflicts are resolved in the source specification.

**Recommended next step:** Use Codex's proposal as the technical baseline, incorporate Spec Kit's domain and reviewer documentation, correct the source specification, and then produce a consolidated architecture revision for human approval.

---

*Review report only. No source requirements, generated proposals, or application code were modified as part of this review.*
