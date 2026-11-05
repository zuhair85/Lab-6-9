# ChatGPT — Architecture Comparison and Cross-Check Prompt

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
