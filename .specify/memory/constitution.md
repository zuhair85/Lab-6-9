<!-- Sync Impact Report
Version change: 0.0.0 -> 1.0.0
Modified principles: placeholder template -> Requirement-First and Traceable Delivery; placeholder template -> Object-Oriented Design with Clear Separation of Concerns; placeholder template -> Financial Integrity Through Exact Arithmetic; placeholder template -> Test-First, Automated, and Verifiable Quality; placeholder template -> Architecture and Documentation for Human Review
Added sections: SplitSmart Technical Constraints; Review and Quality Workflow
Removed sections: placeholder template scaffolding for unnamed principles and generic governance text
Deferred TODOs: Ratification date pending project approval (RATIFICATION_DATE)
-->

# SplitSmart Constitution

## Core Principles

### I. Requirement-First and Traceable Delivery

Customer requirements are the source of truth for product behavior. The project MUST distinguish between customer requirements and implementation decisions: requirements describe what the user or stakeholder needs; technical choices such as Java 21, Maven, Java Swing, JUnit 5, and PlantUML are implementation decisions unless a customer explicitly approves them as an acceptance constraint. Every feature, bug fix, and report must trace back to a requirement or approved change request so that scope, acceptance criteria, and implementation remain aligned.

### II. Object-Oriented Design with Clear Separation of Concerns

The system SHALL be designed using object-oriented principles with explicit responsibilities for each class, component, and module. GUI code MUST remain separate from business logic, validation logic, and balance calculations. Swing views may display state and capture user input, but domain rules, approval flows, and financial calculations MUST live in classes that are independent from UI presentation. This keeps the system easier to test, extend, and review.

### III. Financial Integrity Through Exact Arithmetic

All monetary calculations MUST use BigDecimal for amounts, splits, settlements, balances, and reports. Floating-point arithmetic is prohibited for money and any calculation that affects balances, payments, or reports. Rounding rules, currency precision, and settlement behavior MUST be defined explicitly and applied consistently across expense creation, reconciliation, and reporting.

### IV. Test-First, Automated, and Verifiable Quality

The project MUST use Maven as the build system and JUnit 5 as the standard automated test framework. New requirements and behavior changes MUST be accompanied by automated tests before acceptance. Domain logic, balance calculations, approval workflows, and payment tracking require relevant automated validation. If behavior is user-visible, it must be verified through the smallest practical test that confirms the requirement and its governing business rule.

### V. Architecture and Documentation for Human Review

The project SHALL document significant architecture, business flows, and key design choices with PlantUML when the structure is not obvious from code alone. Design documentation and implementation must stay synchronized. AI-generated code, design suggestions, and analysis are not accepted as final without human review and approval. Human reviewers MUST confirm requirement alignment, correctness, and financial integrity before the work is considered complete.

## SplitSmart Technical Constraints

The implementation MUST align with the customer requirement set for a shared-expense application, including user accounts, group management, expense creation, notifications, approval workflow, balance tracking, payment tracking, and reporting. The project may choose Java 21 and Java Swing as implementation decisions, but these decisions do not replace customer requirements. All technical choices must be documented as engineering decisions, not as user requirements. Maven and JUnit 5 are required standards for build automation and test execution. Object-oriented design must support maintainability, traceability, and clear responsibility boundaries between UI and domain logic.

The customer's primary platform requirement is web-based delivery. A Java Swing MVP may be developed as a limited implementation or academic prototype, but it MUST be explicitly labeled as such and MUST NOT be treated as satisfying the web-based platform requirement. Any decision to change the primary delivery platform requires explicit stakeholder approval and traceability to an approved change request.

## Review and Quality Workflow

All work MUST follow a traceability chain: customer requirement -> acceptance criteria -> design decision -> implementation -> verification -> review. Any change affecting money, approval rules, balance calculations, or reporting requires explicit review and validation before acceptance. Human reviewers MUST verify that AI-generated output does not introduce requirement drift, hidden assumptions, or incorrect domain behavior. When a decision is made for technical reasons, the team MUST explain the reason and record it as an implementation choice rather than a customer requirement.

## Governance

The SplitSmart Constitution governs project decisions related to requirements, architecture, testing, and review. Amendments require a written proposal, a rationale tied to the affected principle or constraint, and approval by the project owner or designated review authority before adoption. Each revision MUST update the version number using semantic versioning: MAJOR for breaking governance or principle changes, MINOR for new or materially expanded guidance, and PATCH for clarifications or non-semantic wording updates. Compliance is reviewed through design review, code review, test validation, and final acceptance. Requirements must not be silently transformed into implementation decisions; a design choice must be labeled and justified as such.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): original adoption date not yet established | **Last Amended**: 2026-10-29
