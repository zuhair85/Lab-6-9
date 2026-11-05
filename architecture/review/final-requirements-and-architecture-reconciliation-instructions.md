# SplitSmart Final Requirements and Architecture Reconciliation Instructions

**Purpose:** Direct the reconciliation of the existing SplitSmart customer requirements, feature specification, Spec Kit proposal, and Codex proposal into one coherent, reviewable baseline for human approval.

**Repository:** zuh​​air85/Lab-6-9  
**Target branch:** main  
**Technical baseline:** architecture/codex/  
**Status:** Instructions only — this file does not approve requirements or architecture.

## 1. Mission and expected outcome

Produce a single internally consistent, complete, traceable, implementation-ready (but not yet implementation) product and technical baseline for SplitSmart. Reconcile the requirements and non-functional requirements, architecture, detailed design, data model, interfaces, workflows, UML, testing and supporting documentation.

Use the Codex proposal as the **technical starting point**, not as unquestionable authority. Preserve useful Spec Kit material where it improves domain clarity, requirements readability, acceptance criteria, examples, and reviewer usability. Do not merely concatenate the two proposals.

The result must be suitable for stakeholder review of what SplitSmart must do; architecture review of how the system is structured; design and data review before implementation; test planning and acceptance review; and later implementation without a developer or coding agent inventing missing business rules.

Do not write application code, generate migrations, or claim the system is implemented. PlantUML source files are required; rendered images are optional.

## 2. Inputs to inspect

Read the current contents on main before editing. Do not rely on stale local copies.

### Authoritative and governing inputs
1. UserRequirement.md — original customer requirements; preserve as the unmodified customer source.
2. .specify/memory/constitution.md — project principles and technical constraints.
3. specs/001-splitsmart-expense-tracker/spec.md — current detailed requirements, scenarios, acceptance criteria, clarifications, and open questions.

### Codex technical baseline

Inspect all files under architecture/codex/, including README.md, architecture.md, domain-model.md, data-design.md, workflows.md, interfaces.md, security-quality.md, testing-strategy.md, decisions-risks.md, and all existing diagrams/*.puml files.

### Spec Kit proposal and prior review

Inspect the existing Spec Kit outputs under specs/001-splitsmart-expense-tracker/, including the plan, research, data model, contracts, quickstart, and diagrams. Also read architecture/review/architecture-comparison-and-cross-check.md.

Search the repository for other relevant decisions, prompts, and project documents. Record the exact files and current Git commit inspected in the reconciliation report.

## 3. Authority, precedence, and decision discipline

Apply this precedence:

1. Explicit customer statements in UserRequirement.md.
2. Project Constitution, for governance and mandatory engineering constraints; it does not silently create new customer-facing product behavior.
3. Explicit stakeholder clarifications already recorded in the feature specification.
4. Approved, documented stakeholder decisions made during this reconciliation.
5. Existing feature specification details that do not conflict with higher-priority sources.
6. Codex proposal as the preferred technical baseline.
7. Spec Kit proposal as a complementary source of useful design and documentation.
8. New engineering recommendations, clearly labelled as proposals until approved.

Rules:
- Do not silently convert an engineering preference into a customer requirement.
- Do not silently resolve a product ambiguity by choosing whichever proposal is easiest to implement.
- Every requirement and decision must have a stable ID, source, status, rationale where applicable, and traceability to design and tests.
- Use explicit statuses such as Approved, Existing clarification, Proposed—approval required, Open question, Deferred, and Out of scope.
- Where a stakeholder decision cannot be obtained, preserve the question, describe viable options and consequences, identify affected requirements/design, and mark the baseline as conditional or blocked. Do not invent an answer.
- Distinguish decisions required before implementation from decisions that can safely be deferred.
- Keep the original customer file and Constitution intact unless an authorized owner explicitly approves a change. Do not invent the Constitution ratification date; retain its TODO until the project owner supplies the actual date.
- Preserve the distinction between the primary web-based customer product and the limited Java Swing academic MVP subset. A Swing prototype must never be described as satisfying the web platform requirement.

## 4. Mandatory known issues to reconcile

Explicitly investigate, document, and resolve or retain as open each item below.

### 4.1 Expense approval versus balance activation

The specification has wording suggesting an expense save immediately updates balances, while the customer requirement and other specification sections require review/approval before an expense is added and used to adjust balances.

Define one precise lifecycle. At minimum, distinguish draft (if supported), submitted/pending review, approved, rejected, cancelled/withdrawn (if supported), and effective in the ledger.

Specify exactly when an expense creates obligations and affects balances. Unless an approved stakeholder decision says otherwise, preserve the approval gate: submission and approval are separate; a pending or rejected expense must not affect effective balances. Define who may approve, whether creator approval is prohibited, quorum/levels, timeout, edits after submission, resubmission, and conflict handling. If approval policy is not settled, keep it explicitly open and define a configurable design boundary without pretending the policy is approved.

### 4.2 Payment recording versus reconciliation

An existing clarification says a recorded payment remains in history and the balance stays active until a separate reconciliation step confirms settlement. Some FR-012/AC-005 wording conflicts with this.

Make the distinction normative:
- Recording a payment creates a payment record/evidence and does not itself settle an obligation.
- Reconciliation is a separate authorized action.
- Only successfully reconciled allocations change effective outstanding obligations/balances.
- Payment history and reconciliation history remain auditable.

Define or explicitly leave open partial payments, multiple allocations, overpayment, underpayment, reversals, failed/disputed payments, duplicate submissions, currency mismatch, and correction/void workflows. Do not treat a payment record as proof of a completed transfer unless the customer approves that meaning.

### 4.3 Payer and participant semantics

Existing clarification: expense creator is payer by default, and all participants must already be confirmed members of the relevant group. Resolve the missing semantics:
- Can payer be excluded from the beneficiary/participant list?
- Can the payer be someone other than the creator?
- Can a user pay on behalf of another group member?
- Is payer always a group member?
- How are payer's own share and net obligation represented?
- Can an expense have only one participant?
- How are departed, suspended, or removed members treated in historical expenses?

If no approved answer exists, document alternatives and impact. Ensure the data model and ledger do not assume an unapproved answer.

### 4.4 Split calculation and monetary precision

Preserve the existing clarified rule: reject invalid amounts and percentage totals other than exactly 100%; round shares to cents and assign the residual cents to the final participant so allocations sum exactly to the expense amount.

Specify deterministic participant ordering for residual allocation, rounding mode and when applied, currency and supported minor-unit precision, whether a group has one currency or expenses can use multiple currencies, behavior for currencies with zero/two/three minor units, minimum/maximum amount and allowed scale, percentage input precision and normalization, and handling for negative values, zero values, and precision overflow.

Do not assume USD-only or hard-code two decimal places as a universal currency rule without approval. Continue to use Java BigDecimal and database decimal types; prohibit floating-point monetary calculations.

### 4.5 Other specification defects and open questions

- Correct the stale Requirement Traceability Summary mappings. At least: notifications map to FR-009, approval to FR-010, balances to FR-011, payments to FR-012, reporting to FR-013/FR-014, and implementation-choice separation to FR-017. Verify every mapping against actual requirement text and include all relevant FR/RI/NFR/AC/SC IDs.
- Close or narrow OQ-001 because in-app notifications are already the default; leave optional channels as deferred unless newly approved.
- Narrow OQ-004 to unresolved partial/multiple payment and reconciliation behavior; retain the already clarified payment-history/reconciliation gate.
- Keep OQ-002 (approval policy) and OQ-003 (receipt inclusion/requirement) open unless stakeholders decide them.
- Resolve the conflict between AC-003 and approval lifecycle acceptance criteria.
- Identify any further inconsistencies discovered while reviewing all files.
- Keep reporting scope, report parameters, exports, and privacy boundaries aligned with the original customer requirement; do not invent a mandatory export format.

## 5. Requirements baseline to produce

Create a corrected, complete requirements specification. Preserve all original customer features and identify academic MVP scope separately.

### 5.1 Actors and scope

Define primary and supporting actors, at minimum account holder, group member, expense creator/payer, participant, reviewer/approver, group administrator (only if justified), and system administrator/support role (only if in scope). State actor permissions and whether roles can overlap.

Define system boundary, assumptions, exclusions, dependencies, product target, and academic MVP subset.

### 5.2 Functional requirements

Review and retain existing FR identifiers where their meaning remains stable. Do not reuse an ID for a different requirement. Add new IDs only when necessary and maintain a change map for renamed, split, merged, or retired IDs.

Requirements must be atomic, testable, uniquely identified, and written as observable system behavior. Cover at least:
- Account registration, authentication, account lifecycle, and profile.
- Group creation, update, membership/invitations, roles, leaving/removal.
- Expense entry, edit rules, payer, date, description, group and participants.
- Equal and percentage split calculations and validation.
- Receipt attachment, access, storage lifecycle, and whether mandatory/optional/deferred.
- Approval request, reviewer authorization, decision, rejection, resubmission, and audit.
- In-app notification creation, delivery, read/unread behavior, and preferences.
- Ledger/obligation creation, balance calculation, history and recalculation.
- Payment record, allocation, reconciliation, correction and audit.
- Reports, summaries, date filters, group/user scopes and access.
- Authorization, privacy, audit, retention and data export/deletion if approved.
- Error handling and validation.

For each FR include: ID, shall-statement, rationale/source, priority, status, preconditions, main behavior, failure/edge behavior, related actors, acceptance criteria, and linked NFR/design/test IDs. Avoid vague words such as fast, secure, user-friendly, or appropriate unless measurable or elaborated.

### 5.3 Non-functional requirements

Audit the current NFR list and produce measurable, testable NFRs. Do not invent numeric service-level targets and present them as stakeholder-approved. For each missing target, propose a value/range with rationale and label it Proposed—approval required, or leave a measurable placeholder and identify the decision owner.

Cover relevant categories:
- Performance and response-time targets for key use cases.
- Capacity, concurrency and scalability assumptions.
- Availability, backup, recovery point objective and recovery time objective.
- Security: password storage, session handling, authorization, rate limiting, secrets, transport and storage protection.
- Privacy and data minimization.
- Financial accuracy, precision, deterministic calculation and ledger consistency.
- Accessibility and usability, including applicable standard/level if approved.
- Browser/device compatibility for the web product.
- Maintainability, modularity, observability and supportability.
- Auditability and traceability.
- Data integrity, transactionality, idempotency and concurrency.
- Testability and deployment/release requirements.

For every NFR specify metric, target or proposed target, measurement method, verification test, scope, priority and approval status. Do not assert regulatory compliance without an identified applicable requirement and evidence.

### 5.4 Scenarios and acceptance criteria

Retain user stories/use cases and independent test scenarios. Acceptance criteria must describe observable outcomes and cover normal, boundary, invalid, authorization, concurrency and failure cases. Ensure no acceptance criterion contradicts a lifecycle or financial invariant.

Create a requirement-to-acceptance-test traceability matrix. Every in-scope FR and NFR must have at least one verification method.

## 6. Architecture and detailed design baseline

Use the Codex modular-monolith / ports-and-adapters proposal as the default technical foundation, subject to the checks below.

### 6.1 Architecture decisions to validate

- Modular monolith; do not introduce microservices without a documented, compelling requirement.
- Domain and application logic independent of web or Swing presentation.
- Inward dependency direction; domain must not depend on UI, framework, database, or transport.
- UI does not calculate splits, balances, or settlement outcomes.
- Application use cases orchestrate authorization, transactions and ports; domain enforces invariants.
- Infrastructure adapters implement repository, transaction, password hashing, clock, receipt storage, notification, and other required ports.
- Relational persistence is the preferred proposal for constraints and transactions; database vendor remains a decision unless already approved.
- Use Java 21, Maven, JUnit 5, and PlantUML as Constitution-governed engineering constraints.
- Use BigDecimal for all money and exact decimal types in persistence.
- Make the web adapter the customer product target. Keep Swing as an optional academic adapter/subset only.

### 6.2 Required architecture documentation

Document system context and external actors/systems; architecture drivers and quality attribute scenarios; module responsibilities and allowed dependencies; logical and runtime views; application use cases and command/query boundaries; transaction boundaries and consistency guarantees; authorization enforcement points; persistence and external storage boundaries; error handling, logging, monitoring and audit strategy; deployment topology as a proposal with unresolved hosting decisions explicit; web and Swing adapter boundaries; extension points and deliberately excluded capabilities.

Provide a dependency rule or module dependency matrix that can be checked during implementation. Explain why modular monolith is preferred over alternatives.

### 6.3 Detailed design

Produce class/interface-level design for each relevant module. For every important class/interface document responsibility, invariants, key methods/contracts, dependencies, lifecycle, and test seams. Cover at least identity/authentication; groups/membership; expenses/split strategies; approval policy/decisions; obligations/ledger/balance projection; payments/allocations/reconciliation; notifications; reporting; audit; repositories, transaction abstraction and infrastructure adapters.

Use value objects where they protect invariants (for example Money, Currency, Percentage, UserId, GroupId, ExpenseId, PaymentId, DateRange). Avoid anemic domain models and oversized service classes. Explain aggregate boundaries and consistency boundaries. Do not over-model speculative features.

## 7. Data design and persistence deliverables

Produce a logical data model, ERD, data dictionary and persistence constraints.

For every entity/table document purpose and owning module; primary key and foreign keys; attributes, types, nullability and defaults; uniqueness and check constraints; indexes and query patterns; lifecycle/status values; retention and deletion rules; sensitive/confidential classification; and audit requirements.

Explicitly assess the Codex proposal's users, groups, memberships, expenses, expense_shares, receipts, approvals, notifications, payments, obligations, payment_allocations and audit_events. Add, remove or reshape entities only with rationale.

Specify:
- How immutable financial facts differ from rebuildable projections.
- Ledger event/obligation derivation and deterministic replay/rebuild.
- How expense approval creates effective obligations.
- How payment reconciliation allocates against obligations.
- Transaction isolation/locking or optimistic version strategy.
- Idempotency keys and duplicate handling.
- Referential integrity and historical membership semantics.
- Database decimal precision and currency metadata.
- Privacy, receipt storage, file validation, access control, retention and deletion.
- Backup and restore implications.

Do not make the database vendor or receipt storage provider a final decision without approval. Include a logical schema independent of a specific SQL dialect and label vendor-specific DDL as deferred.

## 8. API and interface contracts

Define the presentation-independent application interface and, if appropriate, a proposed web API contract. Include operation name and purpose; actor and authorization rule; request/command fields and validation; response/query model; error codes and validation behavior; idempotency and version/concurrency semantics; transaction boundary; and requirement/test traceability.

Cover account, group, membership, expense submission, approval, balance query, payment recording, reconciliation, notifications, and reports. Avoid exposing persistence entities directly. Specify money and date serialization unambiguously. Keep external API technology and endpoint conventions proposed until approved.

## 9. Mandatory UML and PlantUML deliverables

Create valid, source-controlled PlantUML files under architecture/final/diagrams/. Diagrams must reflect the same names, responsibilities, states and relationships as the text/data design. Include a short purpose and scope note in each file or its index.

Required diagrams:

1. **Use-case diagram(s):** system boundary, actors, and major use cases for account/group management, expense/split/receipt, approval, notifications, balance, payment/reconciliation and reporting. Use include/extend only when semantically justified.
2. **System context diagram:** SplitSmart boundary and human/external actors or systems; distinguish confirmed integrations from future possibilities.
3. **Component diagram:** presentation adapters, application/use-case components, domain modules, ports, infrastructure adapters, and dependency direction.
4. **Package/module diagram:** package ownership and allowed dependencies.
5. **Detailed class diagrams:** one or more readable diagrams for identity/groups, expense/splitting/approval, ledger/payment/reconciliation, and notifications/reporting/audit. Show important attributes, operations, interfaces, multiplicities, composition/aggregation and dependencies. Do not cram all classes into one unreadable image.
6. **Sequence diagrams:** at minimum register/sign in; submit expense with participant validation and split calculation; approve/reject expense and activate obligations only on approval; record payment without settling balance; reconcile payment and allocate obligations transactionally; generate an authorized date-filtered report. Include relevant alternate/error paths and transaction boundaries.
7. **State machine diagrams:** at minimum expense lifecycle, approval decision lifecycle if separate, and payment/reconciliation lifecycle. Ensure state names and transitions match requirements and data model.
8. **Activity diagrams:** at minimum expense submission/approval, split validation/calculation, payment recording/reconciliation, and report generation. Include decision guards and failure paths.
9. **ER diagram:** entities, relationships, cardinalities and key constraints, consistent with logical schema.
10. **Optional deployment diagram:** only if a meaningful deployment proposal can be made; mark infrastructure choices as proposed and do not imply hosting has been selected.

Use clear names and stable diagram filenames. Ensure PlantUML syntax is valid and diagrams render. Cross-check all diagrams against the text and one another; no diagram may encode a different business rule.

## 10. Security, privacy, audit and operational design

Provide a threat-aware security section. At minimum address secure password hashing (never plaintext or reversible password storage); authentication and session lifecycle; authorization at every use case and object/group boundary; prevention of insecure direct object reference and cross-group data leakage; input validation and output encoding; rate limiting and abuse controls; secure receipt upload/download, content type/size validation, private storage and malware scanning proposal; secret management and secure transport; audit event integrity and minimization of sensitive data in logs; data retention, account closure and deletion conflicts with financial audit records; backup, restore and incident response; dependency and vulnerability management.

Distinguish controls required by approved NFRs from proposed controls. Do not claim a security certification or compliance status.

## 11. Testing and verification strategy

Create a test strategy aligned with Constitution Principle IV. Include unit tests for value objects, split algorithms, rounding and invariants; application/use-case tests for authorization and lifecycle; repository and transaction integration tests; API contract tests; web adapter/UI tests as appropriate; security and group-isolation tests; concurrency, idempotency, retry and duplicate tests; ledger rebuild/reconciliation consistency tests; report correctness and date-boundary tests; accessibility and performance verification where NFRs require them.

Use JUnit 5 and Maven. Define test data, deterministic clock strategy, test doubles, database test strategy and acceptance test mapping. Financial tests must assert exact decimal outcomes and conservation invariants, including:
- Sum of shares equals expense amount.
- Pending/rejected expenses do not affect effective balances.
- Recording payment alone does not settle an obligation.
- Reconciled allocations cannot exceed eligible outstanding amounts.

Do not claim test-first compliance merely because a test plan exists. Identify which tests must be written before implementation and report execution evidence only when actually run.

## 12. Required document and file structure

Create or consolidate the following canonical outputs. If an existing file already serves a purpose, update it in place where safe and record the change; do not create redundant competing sources of truth.

    specs/001-splitsmart-expense-tracker/
      spec.md                         # canonical functional + non-functional requirements
      requirements-traceability.md    # FR/RI/NFR/AC/test/design cross-reference
      decisions-and-open-questions.md # stakeholder decisions, unresolved items, owners
      acceptance-test-plan.md         # scenario-level verification plan

    architecture/final/
      README.md                       # index, status, baseline and reading order
      architecture.md                 # context, drivers, views, modules, dependencies
      detailed-design.md              # classes, aggregates, ports, use cases, rules
      data-design.md                  # logical schema, ERD reference, data dictionary
      interfaces.md                   # application/API contracts and errors
      workflows.md                    # normative lifecycle and transaction flows
      security-privacy-operations.md  # security, privacy, audit, operations
      testing-strategy.md             # test layers, quality gates and verification
      decisions-risks.md              # ADR-style decisions, risks, unresolved choices
      diagrams/
        use-cases.puml
        context.puml
        components.puml
        packages.puml
        class-identity-groups.puml
        class-expense-approval.puml
        class-ledger-payments.puml
        class-notifications-reporting.puml
        sequence-registration-login.puml
        sequence-expense-submission.puml
        sequence-expense-approval.puml
        sequence-payment-recording.puml
        sequence-payment-reconciliation.puml
        sequence-report-generation.puml
        state-expense.puml
        state-approval.puml
        state-payment-reconciliation.puml
        activity-expense-approval.puml
        activity-split-calculation.puml
        activity-payment-reconciliation.puml
        activity-report-generation.puml
        erd.puml
        deployment.puml               # optional, only if justified

Adjust names only when necessary, and document any omission. Do not delete the original Codex or Spec Kit proposal artifacts; retain them as historical inputs. Clearly label architecture/final/ as the consolidated candidate baseline pending human approval until approval is explicitly recorded.

## 13. Consistency and completeness gates

Before presenting the result for review, perform and document these checks:

1. Every original customer feature is preserved or has an explicitly approved scope disposition.
2. Every RI, FR, NFR, acceptance criterion and open question has a valid ID and consistent mapping.
3. Every FR/NFR maps to one or more acceptance tests and relevant design elements.
4. Every design component/class maps back to one or more requirements or is labelled as an enabling engineering choice.
5. Every table/entity supports documented domain behavior; every persisted field has a purpose.
6. Every API/use-case contract enforces the same authorization and lifecycle rules as the requirements.
7. All financial calculations use exact decimal arithmetic; split and ledger invariants are explicit and tested.
8. Expense approval and payment reconciliation semantics are consistent across requirements, workflows, data, APIs, diagrams and tests.
9. Every UML diagram matches the prose, class model, data model and other diagrams.
10. No Swing artifact claims to fulfill the web requirement.
11. Proposed technical choices and unapproved stakeholder decisions are clearly separated.
12. No unresolved issue is silently hidden in a footnote or assumed away.
13. PlantUML files parse/render successfully; include validation evidence and any tool/version used.
14. No implementation code or unverified test results are represented as completed work.

Include a final reconciliation checklist and a concise list of blocking decisions.

## 14. Stakeholder decision register

For each open decision, provide decision ID and question; why a decision is needed; options with advantages, disadvantages and consequences; recommended option (clearly marked as recommendation, not approval); affected requirements, architecture, data, APIs, diagrams and tests; decision owner and target milestone (use TBD if unknown); and status/date only when known.

At minimum revisit approval policy, receipt MVP scope/retention, payer/participant semantics, currency model/precision, partial and multiple payments, overpayments/reversals, group membership lifecycle, and measurable NFR targets. Also identify any additional issue found during reconciliation.

## 15. Final report and handoff

Create architecture/final/README.md as the entry point. It must state:
- This is a consolidated candidate baseline pending human approval.
- Exact source commit and source files used.
- Which Codex decisions were retained, changed or rejected and why.
- Which Spec Kit material was incorporated.
- What requirements were corrected.
- All unresolved stakeholder decisions and their impact.
- Document/diagram index and recommended review order.

Create a concise reconciliation report, either in the README or a separate architecture/final/reconciliation-report.md, summarizing conflicts, resolutions, additions, deferred decisions, traceability results, and validation evidence.

Do not mark the architecture or requirements as approved merely because the reconciliation work is complete. Human approval must be explicitly recorded by the project owner. Do not commit generated binaries or rendered diagram exports unless requested.

## 16. Git and change-management instructions

- Work directly on main only if the repository owner has authorized direct commits; that authorization has already been given for this project.
- Inspect the working baseline and current branch before writing.
- Make changes in coherent, reviewable commits with descriptive messages.
- Preserve historical Codex and Spec Kit artifacts; do not overwrite the original customer requirements.
- Do not delete or rename existing files without documenting the reason and checking references.
- Validate Markdown links and PlantUML syntax where tooling is available.
- Report files created/updated, commit SHA(s), validation actually performed, and remaining blockers.
- If stakeholder decisions are unavailable, still produce the strongest coherent candidate baseline while leaving those decisions explicitly open; do not fabricate approval.

## Definition of done

The reconciliation is ready for human review only when the canonical requirements, architecture, detailed design, logical data model/data dictionary, interface contracts, workflows, security/quality strategy, traceability, decision register, acceptance test plan, and all mandatory UML source diagrams exist and pass the consistency gates above. The result remains pending human approval until the project owner reviews and approves it.
