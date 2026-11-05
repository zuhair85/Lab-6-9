# Spec Kit — Architecture and Technical Plan Prompt

## 0. Project context and source-of-truth rules

The repository is the working context. Before generating anything, read these files from the current branch:

1. `.specify/memory/constitution.md` — governing principles and technical constraints.
2. `UserRequirement.md` — original customer requirements; preserve these as the customer source of truth.
3. `specs/001-splitsmart-expense-tracker/spec.md` — clarified feature specification, including the Clarifications section, requirement IDs, acceptance criteria, assumptions, and open questions.
4. Relevant Spec Kit templates and repository configuration where needed.

The project is **SplitSmart**, an expense-sharing application for friends, roommates, family members, and coworkers.

### Important project constraints

- The customer's stated primary platform is **web-based**.
- The Constitution permits a **Java 21 / Java Swing MVP as a limited academic prototype**, but it must be explicitly labeled as a subset and must not be represented as satisfying the customer's web-platform requirement.
- Technical standards in the Constitution include Java 21, Maven, JUnit 5, object-oriented design, separation of UI from domain logic, BigDecimal for all monetary arithmetic, and PlantUML for architecture/design diagrams where useful.
- Financial calculations must use exact decimal arithmetic; floating-point types must not be used for money.
- Human review is mandatory. AI-generated architecture and design are proposals, not approved decisions.
- Preserve traceability: customer requirement → clarified specification / acceptance criterion → architecture or design decision → verification approach.
- Do not implement the application, generate application source code, or silently change requirements as part of this architecture/design task.

### Clarifications already recorded in spec.md

Treat these as decisions unless the source files show a later approved change:

- The expense creator is the payer by default.
- Every expense participant must already be a confirmed member of the relevant group.
- Equal/percentage split rounding: round shares to cents, then assign residual cents to the final participant so the shares sum exactly to the expense total.
- Invalid amounts and percentage splits not totaling exactly 100% must be rejected with a clear validation message.
- Authentication uses username-or-email plus password with secure authentication.
- A payment is retained in history; the balance remains active until a separate reconciliation step confirms settlement.
- In-app notifications are the default; additional channels may be considered later.

### Known issues to verify, not silently repair

The current specification may contain internal inconsistencies or stale text. Explicitly identify and report them:

1. The clarified payment decision says balances remain active until a separate reconciliation step, while some acceptance criteria / functional requirement wording may imply that entering a payment immediately reduces or clears the balance.
2. The Clarifications section resolves notification delivery, payment handling, and other topics, but some corresponding Open Questions may still remain listed as unresolved.
3. The Requirement Traceability Summary may contain FR-ID mappings that do not match the actual Functional Requirements section.
4. The product's web-based customer platform requirement and the Java Swing academic MVP must remain clearly distinguished.
5. The Constitution's ratification date is still marked TODO. Do not invent a ratification date.

For each issue, cite the exact source section/ID and recommend whether it needs a specification correction, an explicit stakeholder decision, or merely a documented design choice. Do not make unilateral product decisions.

---

---

# 1. Prompt for Spec Kit — Architecture / Technical Plan

**How to run:** In the repository workspace, use the Spec Kit planning workflow (normally `/speckit.plan`). Paste the prompt below as the planning input. Use the repository's installed Spec Kit commands and templates; do not assume a different version's command syntax if the installed workflow differs.

## Spec Kit prompt

You are the **Spec Kit planning agent** for the SplitSmart project. Generate the architecture and technical design plan for feature `001-splitsmart-expense-tracker`.

### Mandatory preparation

1. Read all source-of-truth files listed in Section 0, especially the complete Constitution, original customer requirement, and clarified `spec.md`.
2. Inspect the actual repository structure, build configuration, installed Spec Kit workflow, and templates. Do not assume files, dependencies, or infrastructure that are not present.
3. Treat the Constitution and clarified specification as governing inputs. Do not edit `UserRequirement.md`, `constitution.md`, or `spec.md`.
4. Before finalizing the plan, check for the known inconsistencies in Section 0 and record them as risks, open decisions, or specification issues. Do not silently resolve them.

### Objective

Create a concrete, reviewable architecture and design proposal that explains how SplitSmart should be structured while preserving the distinction between:

- the customer's target web-based product; and
- the limited Java Swing academic MVP permitted by the Constitution.

The architecture must not imply that a Swing desktop implementation fulfills the web-platform requirement. If the repository's current implementation target is ambiguous, state the ambiguity and present a clearly labeled architecture boundary or alternative rather than inventing approval.

### Required analysis

Address each of the following:

1. **Architecture style and rationale**
   - Recommend a suitable architecture style and explain why it fits the project scale, requirements, and academic context.
   - Show clear boundaries between presentation, application/use-case orchestration, domain/business rules, and persistence/infrastructure.
   - Explain how the architecture can support the web target without falsely claiming the Swing MVP is the web product.
   - Identify which elements are shared domain capabilities and which are delivery-platform-specific adapters.

2. **Modules / components and responsibilities**
   - Identify the major modules, components, packages, or layers.
   - Define each responsibility and its allowed dependencies.
   - Keep GUI code separate from business logic, validation, and financial calculations.
   - Identify authentication/authorization, group management, expense management, split calculation, approvals, notifications, balances, payments/reconciliation, reporting, and receipt handling responsibilities.
   - Avoid unnecessary microservices or distributed infrastructure unless justified by explicit requirements.

3. **Domain model and data design**
   - Identify core entities, value objects, relationships, lifecycle states, and invariants.
   - At minimum consider User, Group, GroupMembership, Expense, ExpenseParticipant / Split, Receipt, ApprovalRecord, Notification, Payment, Reconciliation / Settlement, and audit/history records.
   - Define the distinction between payer, participants, shares, debts, payments, and confirmed settlement.
   - Explain how group membership status affects expense eligibility.
   - Explain expense approval lifecycle and when an expense becomes balance-effective.
   - Explain payment recording versus reconciliation confirmation. Do not assume payment entry alone settles a debt.
   - Specify monetary representation using BigDecimal and currency precision. Describe the exact residual-cent allocation rule and percentage validation.
   - Identify uniqueness, referential integrity, and authorization constraints.

4. **Key workflows and behavior**
   - Account registration and authentication.
   - Create/manage group and confirm membership.
   - Create expense, validate participants, calculate equal or percentage splits, attach optional receipt, submit for review.
   - Approve/reject expense and determine when it affects balances.
   - Notify relevant members.
   - Record payment and separately reconcile/confirm settlement.
   - View balances and generate date-range reports.
   - Include failure paths and important edge cases.

5. **Interfaces and contracts**
   - Identify important application service / use-case interfaces and their inputs/outputs at a conceptual level.
   - Identify validation and domain errors.
   - Describe persistence boundaries and transaction requirements.
   - Identify any external interfaces only when supported by the requirements; mark optional future integrations as such.
   - Do not invent REST endpoints, UI screens, or external providers as approved requirements. Proposed examples must be labeled as design proposals.

6. **Security, privacy, and reliability**
   - Authentication, password handling, authorization, group-level access isolation, and protection of receipt images.
   - Auditability of financial changes.
   - Transactional consistency for expense creation, split allocation, payment recording, and reconciliation.
   - Validation, error handling, backup/recovery considerations, and logging without leaking sensitive information.

7. **Testing and verification strategy**
   - Align with Maven and JUnit 5 as required by the Constitution.
   - Include unit, integration, persistence, authorization, and workflow tests as appropriate.
   - Include exact-money edge cases: fractional cents, residual allocation, percentage totals, invalid/negative/zero amounts, partial payments, overpayments, and reconciliation.
   - Map tests to FR IDs and acceptance criteria.
   - Do not claim tests were executed if no implementation exists.

8. **Architecture diagrams**
   - Provide PlantUML source for useful diagrams, such as context/component or layered architecture, domain class model, and key workflow/state diagrams.
   - Keep diagrams consistent with the written design.
   - Do not create decorative diagrams that add no explanatory value.

9. **Trade-offs and decisions**
   - List major design decisions with rationale, alternatives considered, consequences, and unresolved decisions.
   - Separate constitutional constraints, explicit specification decisions, and proposed implementation choices.
   - Identify any decision requiring stakeholder approval.

### Deliverables

Use the installed Spec Kit plan workflow and the repository's expected artifact locations. Produce the artifacts supported by the installed templates/workflow, typically:

- `plan.md` — architecture approach, technical context, constraints, and decisions.
- `research.md` — evidence, assumptions, alternatives, risks, and unresolved questions.
- `data-model.md` — entities, relationships, invariants, and lifecycle semantics.
- `contracts/` — conceptual interface/API contracts if justified by the project and workflow.
- `quickstart.md` — how a developer/reviewer would understand and validate the proposed architecture, without pretending unimplemented commands exist.
- PlantUML source files for the selected diagrams, in the feature's established documentation structure.
- Any other artifacts required by the actual Spec Kit template.

Do not overwrite existing artifacts without first inspecting them. Do not modify the Constitution or clarified feature specification. Do not implement source code.

### Quality gate before finishing

Verify and report:

- Every relevant FR, NFR, RI, AC, and success criterion is either addressed or explicitly marked out of scope / unresolved with rationale.
- Every major component has a clear responsibility and dependency direction.
- Financial invariants and payment/reconciliation semantics are unambiguous.
- The web target versus Swing MVP boundary is explicit.
- Every assumption and proposed choice is labeled.
- All diagrams agree with the text.
- No requirement was silently dropped or reinterpreted.

Finish with a concise **Spec Kit Architecture Self-Review** listing strengths, weaknesses, unresolved decisions, source inconsistencies, and files created or changed.

---
