# SplitSmart Architecture & Design — Three-Agent Prompt Pack

**Repository:** `zuhair85/Lab-6-9`  
**Feature:** `001-splitsmart-expense-tracker`  
**Purpose:** Produce two independent architecture/design proposals (Spec Kit and Codex), then use ChatGPT as an independent reviewer to compare them and cross-check both against the approved project inputs.

> **Workflow rule:** Run the Spec Kit and Codex prompts independently. Do not show either agent the other agent's generated architecture/design output before it completes its own work. This avoids anchoring and makes the comparison meaningful. ChatGPT performs the comparison only after both outputs are available.

---

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

# 2. Prompt for Codex — Independent Architecture / Design Proposal

**How to run:** Start Codex in the same repository and on the same source branch/revision used for the Spec Kit run. Paste the prompt below. Codex must work independently and must not read the Spec Kit-generated architecture output. Save Codex's work in a separate directory so the two proposals do not overwrite one another.

## Codex prompt

You are an **independent senior software architect and design reviewer**. Create a complete architecture and design proposal for SplitSmart using the repository's existing customer requirements, clarified specification, and Constitution.

### Independence and scope rules

- Work only from the baseline source inputs listed below. Do not inspect or use any architecture/design artifacts generated by Spec Kit for this same exercise.
- Baseline inputs: `UserRequirement.md`, `.specify/memory/constitution.md`, `specs/001-splitsmart-expense-tracker/spec.md`, repository configuration, and relevant existing source/build files.
- Do not modify those baseline files.
- Do not implement application code, generate scaffolding, or make unrelated repository changes.
- Do not claim that the product is web-based if the proposed implementation is only Java Swing. Preserve the customer web-platform requirement and clearly label any Swing implementation as an academic MVP subset.
- Do not invent stakeholder approval, deployment infrastructure, external services, or product requirements.
- Do not silently resolve contradictions. Record them and explain their architectural impact.

### Required work

Perform your own analysis and produce an architecture/design proposal covering:

1. **System context and scope**
   - Actors, external dependencies, system boundary, product capabilities, and exclusions.
   - Distinguish customer requirements from implementation choices.
   - Explain the relationship between the web-based target and Java Swing MVP.

2. **Architecture**
   - Recommend architecture style and justify it.
   - Define layers/modules and responsibilities.
   - Define dependency direction and boundaries.
   - Explain how UI delivery can be separated from shared domain/application behavior.
   - Avoid premature microservices or infrastructure complexity.

3. **Domain design**
   - Propose entities, value objects, relationships, invariants, and state transitions.
   - Cover accounts, groups, membership, expenses, participants, splits, receipts, approvals, notifications, balances, payments, reconciliation, reports, and audit history.
   - Explicitly define payer versus participants and how obligations are derived.
   - Define expense approval and balance-effective status.
   - Distinguish payment recorded, payment pending confirmation, and settlement reconciled/confirmed.
   - Specify BigDecimal-based money handling, currency precision, percentage validation, rounding, and residual-cent allocation.

4. **Use cases and workflow design**
   - Registration/login and authorization.
   - Group creation and confirmed membership.
   - Expense submission and validation.
   - Equal and percentage split calculation.
   - Receipt attachment.
   - Approval/rejection and notifications.
   - Balance calculation and reporting.
   - Payment recording and reconciliation.
   - Include normal, alternate, and failure flows.

5. **Data architecture**
   - Propose a logical relational data model (unless another choice is clearly justified).
   - Show tables/entities, primary and foreign keys, cardinalities, constraints, and indexes where useful.
   - Explain transactions and concurrency concerns for financial operations.
   - Explain how historical financial records remain auditable.
   - Treat receipt storage as a design decision with security and privacy implications.

6. **Application interfaces**
   - Describe key use-case services, commands/queries, validation boundaries, and error outcomes.
   - If proposing API contracts, label them as proposals, not existing or approved endpoints.
   - Keep interfaces technology-neutral where possible.

7. **Security and quality attributes**
   - Authentication, password storage, authorization, group isolation, data validation, auditability, reliability, maintainability, usability, and privacy.
   - State quality attributes as measurable targets only when justified; otherwise label them as proposed targets needing approval.

8. **Testing strategy**
   - Follow the Constitution: Maven, JUnit 5, test-first quality, and human review.
   - Include domain unit tests, persistence/transaction tests, authorization tests, and end-to-end workflow tests as appropriate.
   - Include money arithmetic and reconciliation edge cases.
   - Trace tests to requirement IDs and acceptance criteria.
   - Do not claim tests have run.

9. **Diagrams**
   - Include PlantUML source for system context, component/layer architecture, domain model, and important sequence or state workflows.
   - Ensure diagrams and narrative are consistent.

10. **Decision log and risk register**
    - Record decision, rationale, alternatives, consequences, confidence, and whether stakeholder approval is required.
    - Identify requirement ambiguities, source inconsistencies, technical risks, and deferred features.

### Output location and files

Create the Codex proposal only under:

`architecture/codex/`

Create a coherent set of Markdown and PlantUML files, at minimum:

- `architecture/codex/README.md` — executive overview, scope, assumptions, and index.
- `architecture/codex/architecture.md` — system context, architecture style, layers, modules, responsibilities, and dependencies.
- `architecture/codex/domain-model.md` — entities, relationships, invariants, money semantics, and lifecycle states.
- `architecture/codex/data-design.md` — logical schema, constraints, transaction boundaries, and persistence considerations.
- `architecture/codex/workflows.md` — core use cases, sequence/state behavior, alternate flows, and error handling.
- `architecture/codex/interfaces.md` — conceptual application interfaces and proposed contracts.
- `architecture/codex/security-quality.md` — security, privacy, reliability, and quality attributes.
- `architecture/codex/testing-strategy.md` — verification plan and requirement traceability.
- `architecture/codex/decisions-risks.md` — decision log, alternatives, risks, open questions, and source inconsistencies.
- `architecture/codex/diagrams/` — PlantUML source files.

If the project already uses a different documentation convention, preserve the requested separate output boundary and explain the adaptation in the README. Do not write into the Spec Kit output location.

### Required traceability

Include a traceability matrix mapping, at minimum:

- RI-001 through RI-010
- FR-001 through FR-017
- NFR-001 through NFR-007
- AC-001 through AC-010
- SC-001 through SC-005

For each item, identify the architecture element(s), domain rule, workflow, and verification approach that address it. Mark items as unresolved or not applicable only with an explanation. Do not assume that an item is satisfied merely because it is mentioned.

### Codex self-review

Before finishing:

- Check all files for internal consistency.
- Check every diagram against the written design.
- Check that no customer requirement has been dropped.
- Check that no unapproved technology or service has been presented as mandatory.
- Check payment versus reconciliation semantics carefully.
- Check the web-target versus Swing-MVP boundary carefully.
- Report files created, assumptions, unresolved issues, and any source-specification defects.

Do not commit, push, or merge. Leave the work available for human review.

---

# 3. Prompt for ChatGPT — Independent Comparison and Cross-Check

**When to run:** Only after both independent proposals are complete and available in the repository. ChatGPT should read the actual files from GitHub/workspace rather than relying on pasted summaries. If either proposal is incomplete or inaccessible, state that limitation and do not fabricate a comparison.

## ChatGPT comparison prompt

Act as an **independent architecture review board** for the SplitSmart project. Your task is to compare the Spec Kit architecture/design output with the Codex architecture/design output and perform a rigorous cross-check against the original customer requirements, Constitution, and clarified specification.

### Files to inspect

Read the baseline sources:

- `UserRequirement.md`
- `.specify/memory/constitution.md`
- `specs/001-splitsmart-expense-tracker/spec.md`

Read the complete Spec Kit-generated architecture/design artifacts in the feature directory (including plan, research, data model, contracts, quickstart, and diagrams).

Read the complete Codex proposal under `architecture/codex/` (including all diagrams and decision/risk records).

Do not assume that either agent's summary accurately represents its detailed artifacts. Inspect the source files themselves.

### Review principles

- Be neutral. Do not favor Spec Kit or Codex because of tool, style, length, or presentation.
- Evaluate correctness, completeness, traceability, consistency, feasibility, clarity, and compliance with the Constitution.
- The customer requirement and approved clarifications take precedence over both generated proposals.
- A proposal is not correct merely because both agents independently made the same assumption.
- Distinguish a true disagreement from different wording for equivalent designs.
- Do not make a stakeholder decision on the user's behalf.
- Do not implement code or modify the source-of-truth requirements during the review.

### Required review

1. **Input integrity**
   - Confirm both proposals used the same baseline inputs and feature revision.
   - Identify missing, stale, or changed source files.
   - Identify any accidental contamination between the two independent outputs.

2. **Side-by-side comparison**
   - Compare architecture style, layer/module boundaries, dependency direction, domain model, persistence design, workflows, interfaces, security, quality attributes, testing, diagrams, decisions, and risks.
   - For each topic, state Spec Kit's approach, Codex's approach, the meaningful difference, strengths/weaknesses, and your recommendation.
   - Label each difference as: equivalent, complementary, material disagreement, omission, or contradiction.

3. **Requirements cross-check**
   - Verify RI-001–RI-010, FR-001–FR-017, NFR-001–NFR-007, AC-001–AC-010, and SC-001–SC-005 against both proposals.
   - Use a matrix with columns: ID, requirement intent, Spec Kit coverage, Codex coverage, gap/contradiction, recommended correction, verification evidence.
   - Do not mark an item covered based only on a keyword mention; identify the actual component, rule, workflow, or test that addresses it.

4. **Constitution compliance**
   - Requirement-first traceability.
   - Object-oriented design and separation of concerns.
   - BigDecimal / exact monetary arithmetic.
   - Maven and JUnit 5 standards.
   - Test-first and verifiable quality.
   - PlantUML documentation where useful.
   - Human review and approval.
   - Explicit web product versus Swing MVP distinction.
   - Identify any violation with evidence and severity.

5. **Financial correctness review**
   - Verify payer, participants, shares, debts, and balances are modeled consistently.
   - Verify equal and percentage split behavior.
   - Verify cent rounding and residual-cent allocation.
   - Verify invalid amounts and percentage totals are rejected.
   - Verify expense approval determines when an expense affects balances.
   - Verify payment recording does not silently equal settlement if separate reconciliation is required.
   - Verify partial payments, overpayments, reversals/corrections, and audit history are addressed or explicitly unresolved.
   - Identify race conditions, double counting, rounding drift, and transaction risks.

6. **Security and privacy review**
   - Check authentication, authorization, group membership enforcement, receipt access, sensitive logging, audit data, and data isolation.
   - Identify missing threat considerations and any unsupported security claims.

7. **Specification defect review**
   - Independently inspect the source specification for stale Open Questions, inconsistent FR mappings, conflicting payment wording, and web/Swing ambiguity.
   - Separate source-specification defects from architecture-proposal defects.
   - Recommend precise corrections, but do not edit the source files.

8. **Feasibility and proportionality**
   - Identify overengineering, under-design, unsupported dependencies, unnecessary distributed components, and missing operational considerations.
   - Consider the academic MVP constraints without weakening customer requirements.

### Scoring rubric

Score each proposal from 1–5 for:

- Requirement coverage and traceability
- Constitution compliance
- Domain and financial correctness
- Architecture quality and separation of concerns
- Data integrity and persistence design
- Security and privacy
- Testability and verification
- Diagram accuracy and usefulness
- Clarity, consistency, and reviewability
- Feasibility and proportionality

Explain each score with evidence. Do not use a simple average as the only basis for the recommendation. A critical financial, authorization, or requirement-compliance defect must outweigh cosmetic strengths.

### Required final report

Produce a decision-ready report with:

1. Executive summary and overall conclusion.
2. Source files and revisions inspected.
3. Side-by-side comparison table.
4. Requirement cross-check matrix.
5. Constitution compliance matrix.
6. Financial correctness findings.
7. Security/privacy findings.
8. Source specification defects and recommended clarifications.
9. Material disagreements and omissions.
10. Best ideas to retain from each proposal.
11. Recommended consolidated architecture, clearly identifying which elements came from Spec Kit, Codex, or independent reviewer reasoning.
12. Prioritized remediation list:
    - **Critical** — blocks approval or risks incorrect financial/security behavior.
    - **High** — major requirement, architecture, or testability gap.
    - **Medium** — meaningful improvement before implementation.
    - **Low** — clarity or maintainability improvement.
13. Questions requiring the project owner's decision.
14. Final readiness verdict: **Ready for human approval**, **Needs revision**, or **Not ready**.

For every material finding, cite the exact file path and section/heading or requirement ID. Where possible, quote only a short identifying phrase and explain the issue. Do not invent line numbers or evidence.

### Output behavior

- Write the report to `architecture/review/architecture-comparison-and-cross-check.md` only if explicitly asked to save it; otherwise return the report in the conversation.
- Do not edit the generated proposals or baseline source files.
- Do not commit or merge.
- End with a concise list of decisions the project owner must make before implementation planning proceeds.

---

# 4. Recommended execution sequence

1. **Freeze the baseline:** confirm the current branch and source revisions for `UserRequirement.md`, `constitution.md`, and `spec.md`. Avoid changing them during the two generation runs.
2. **Run Spec Kit:** execute the Spec Kit planning workflow with Prompt 1. Save/retain its complete output.
3. **Record the Spec Kit result:** note the commit or revision and list every generated file.
4. **Run Codex independently:** use the same baseline revision with Prompt 2. Do not expose Spec Kit output to Codex. Save Codex output under `architecture/codex/`.
5. **Freeze both outputs:** do not let either agent revise its proposal after seeing the other proposal.
6. **Run ChatGPT review:** use Prompt 3 after both output sets are present.
7. **Human decision:** review the comparison, decide which architecture/design elements to accept, resolve open stakeholder questions, and only then update the canonical project documents.

## Review integrity checklist

- [ ] Same baseline revision used for Spec Kit and Codex.
- [ ] Spec Kit completed without seeing Codex output.
- [ ] Codex completed without seeing Spec Kit output.
- [ ] Both proposals preserve all customer requirements.
- [ ] Web target and Swing MVP are not conflated.
- [ ] Payment recording and reconciliation are distinct.
- [ ] BigDecimal and residual-cent behavior are explicit.
- [ ] Approval lifecycle and balance-effective state are explicit.
- [ ] Requirement traceability and tests are present.
- [ ] ChatGPT comparison cites evidence from actual files.
- [ ] Human reviewer resolves all critical/high findings before implementation.
