# Feature Specification: SplitSmart Expense Tracker

**Feature Branch**: `001-splitsmart-expense-tracker`

**Created**: 2026-10-29

**Status**: Draft

**Input**: User description: "Read UserRequirement.md in this workspace as the authoritative customer requirements. Write a testable SplitSmart feature specification: actors, user scenarios, functional and non-functional requirements, acceptance criteria, requirement IDs (FR-001, etc.), and open questions. Preserve all original customer features in the requirements inventory; label the Java Swing MVP subset separately. Do not write Java code. Do not edit UserRequirement.md."

## Clarifications

### Session 2026-10-29

- Q: Who is treated as the payer when an expense is created? → A: The person who creates the expense is the payer by default; other selected users owe their share to that payer.
- Q: How should the system treat group membership when an expense is created? → A: Every participant must already be a confirmed group member before the expense is saved.
- Q: What rounding rule should the system use when an equal or percentage split produces cents that do not divide evenly? → A: Round each share to the nearest cent, then apply the residual cents to the final participant so the total matches exactly.
- Q: What should happen if a user enters an invalid amount or a percentage split that totals not exactly 100%? → A: Reject the expense and display a clear validation message until the amount and split values are corrected.
- Q: What authentication model should the product use for user accounts and group access? → A: Use a standard username-or-email plus password model with secure authentication for each user.
- Q: When a payment settles a balance, should the system clear the debt immediately, or should it retain a payment history with an outstanding balance until a later reconciliation step? → A: Keep the balance active until a separate reconciliation step confirms settlement.
- Q: What delivery method should the notification system use for new expenses and approval requests? → A: Use in-app notifications as the default delivery method, with optional extra channels later.

## User Scenarios & Testing

### User Story 1 - Create a personal account and join a household or group (Priority: P1)

A user creates a personal account, signs in, and joins or creates a shared group with others. The user can then view the group context and begin tracking shared expenses.

**Why this priority**: Without a valid account and group context, every other feature is unusable or ambiguous.

**Independent Test**: A user can create an account, create a group, and confirm that the group appears in their view and can be used for future expenses.

**Acceptance Scenarios**:

1. **Given** a new user has no account, **When** they create an account and log in, **Then** their personal profile and balance view are available.
2. **Given** the user is logged in, **When** they create a group and invite or add members, **Then** the group is saved and visible to all participants.

---

### User Story 2 - Record and split a shared expense (Priority: P1)

A user adds an expense for a group, provides details, selects a split method, assigns participants, and saves the expense so balances update automatically.

**Why this priority**: Expense creation is the core value of the product and drives all balance and payment calculations.

**Independent Test**: A user can enter a single expense and confirm that each participant's share is reflected in their balance.

**Acceptance Scenarios**:

1. **Given** a user is in a group, **When** they add an expense with amount, date, description, split method, and participants, **Then** the system records it and updates balances for each involved user.
2. **Given** an expense is split equally or by percentages, **When** the expense is saved, **Then** each participant receives the expected share as calculated by the system.
3. **Given** a receipt is attached to an expense, **When** the expense is viewed, **Then** the user can review the receipt image with the expense details.

---

### User Story 3 - Review balances, settle payments, and generate reports (Priority: P1)

A user can view who owes whom, record payments, see updated balances, and generate reports for date ranges and group activity.

**Why this priority**: Accurate balances and transparent reporting are essential to user trust and ongoing participation.

**Independent Test**: A user can settle a payment, verify the remaining balances, and generate a report showing the financial activity of the selected period.

**Acceptance Scenarios**:

1. **Given** multiple expenses exist in a group, **When** the user opens the balances view, **Then** each user's net position relative to others is shown.
2. **Given** one user records a payment to settle a balance, **When** the payment is saved, **Then** the system updates the remaining balance accordingly.
3. **Given** the user selects a date range, **When** they request a report, **Then** the system displays expense, payment, and balance summaries for that period.

---

### User Story 4 - Manage approval and notifications (Priority: P2)

A user receives notices of new expenses or review needs and can complete approval or review steps before the expense affects balances.

**Why this priority**: Approval and notification add governance and communication to shared financial tracking, especially for recurring group use.

**Independent Test**: A user sees a notification for a newly created expense, reviews it, and either approves or rejects it according to the process configured for the group.

**Acceptance Scenarios**:

1. **Given** a group has an approval workflow, **When** an expense is submitted, **Then** a relevant user receives a notification and can review it.
2. **Given** an expense is approved, **When** the approval is recorded, **Then** the expense is accepted into the balance calculation process.
3. **Given** an expense is rejected, **When** the rejection is recorded, **Then** the expense is not counted toward balances until corrected or resubmitted.

---

### Edge Cases

- What happens when an expense includes users who are not group members?
- How does the system handle a group with zero or one active member?
- What happens when a payment exceeds the current balance or leaves a negative remaining amount?
- How does the system respond when a receipt image is missing, corrupted, or unavailable?
- What happens when a user enters a percentage split that does not add up to 100%?
- How does the system behave when reporting with an empty date range or future dates?

## Requirements

### Requirements Inventory (Customer Requirements)

- **RI-001**: Each person using the system MUST have a unique user account for secure access to their own expense and balance information.
- **RI-002**: Users MUST be able to create, update, and manage groups for shared expenses such as roommates, trips, parties, or workgroups.
- **RI-003**: Users MUST be able to create expenses with amount, date, description, split method, and optional receipt image.
- **RI-004**: Expense creation MUST allow the user to specify which users are involved so balances can be adjusted correctly.
- **RI-005**: The system MUST notify users when other group members create new expenses.
- **RI-006**: The system MUST support an approval workflow before expenses are finalized in balance calculations.
- **RI-007**: The system MUST track balances owed by each user to every other user within a group.
- **RI-008**: The system MUST allow users to record payments that settle balances and update the balances accurately.
- **RI-009**: The system MUST provide reports and summaries for expenses, balances, and payments, including date-range filtering.
- **RI-010**: The software's primary supported platform is web-based.

### Java Swing MVP Subset (Implementation Choice)

This subset is a separate implementation choice for a desktop-oriented Java Swing minimum viable product. It does not replace the customer requirement inventory above.

- **MVP-001**: Users can create accounts and log in to a local desktop application.
- **MVP-002**: Users can create and manage groups and member lists.
- **MVP-003**: Users can create expenses with amount, date, description, split method, and participating users.
- **MVP-004**: The application calculates balances and displays who owes whom.
- **MVP-005**: Users can record payments and update balances.
- **MVP-006**: Users can view a basic summary report for a selected date range.
- **MVP-007**: Optional receipt images and multi-step approval can be deferred until after the MVP if project scope requires an earlier release.

### Functional Requirements

- **FR-001**: The system MUST allow each user to create and access a unique account.
- **FR-002**: The system MUST allow authenticated users to create, view, and manage groups.
- **FR-003**: The system MUST allow users to add group members to a shared group.
- **FR-004**: The system MUST allow users to create an expense with a monetary amount, date, description, and at least one participating user.
- **FR-005**: The system MUST support at least two split methods: equal split and percentage split.
- **FR-006**: The system MUST validate that each percentage split totals to 100% before the expense is accepted.
- **FR-007**: The system MUST allow the expense creator to be treated as the payer by default unless another payer is explicitly selected.
- **FR-008**: The system MUST allow an optional receipt image to be attached to an expense.
- **FR-009**: The system MUST notify relevant group members when a new expense is created.
- **FR-010**: The system MUST support an approval review step before an expense affects balances.
- **FR-011**: The system MUST calculate each user's balance relative to other users in the group.
- **FR-012**: The system MUST persist all recorded payments and update the relevant balances after payment entry.
- **FR-013**: The system MUST provide summary and detailed reporting for expenses, balances, and payments.
- **FR-014**: The system MUST support date-based filtering for reports and summaries.
- **FR-015**: The system MUST prevent unauthorized users from viewing or modifying other users' group or expense information.
- **FR-016**: The system MUST maintain a record of each expense and payment change so balances can be reconstructed and audited.
- **FR-017**: The system MUST distinguish customer requirements from implementation decisions so a web-based or Java Swing solution is not treated as a new requirement.

### Non-Functional Requirements

- **NFR-001**: The system MUST provide reliable, understandable balance calculations that are consistent across repeated operations.
- **NFR-002**: The system MUST use exact monetary arithmetic for all cost, split, and payment calculations.
- **NFR-003**: The system MUST protect user and group financial data from unauthorized access.
- **NFR-004**: The system MUST make key balance and payment information understandable to non-technical users.
- **NFR-005**: The system MUST support the normal use of multiple users and groups without losing or miscalculating balances.
- **NFR-006**: The system MUST be usable on the primary supported web platform with clear onboarding and group management flows.
- **NFR-007**: The system MUST support a review process that ensures human verification before financially significant actions are finalized.

## Acceptance Criteria

- **AC-001**: A new user can create an account and log in without accessing another user's data.
- **AC-002**: A logged-in user can create a group and add several participants to it.
- **AC-003**: A user can create an expense with amount, date, description, split method, and participants, and the system updates each involved user's balance accurately.
- **AC-004**: A percentage split that does not total 100% is rejected before the expense is recorded.
- **AC-005**: A payment recorded against a balance reduces or clears the outstanding debt as expected.
- **AC-006**: A user can generate a report for a selected date range that includes the relevant expense, payment, and balance information.
- **AC-007**: A user receives a notification when another group member creates a new expense requiring attention.
- **AC-008**: An expense can be reviewed through the approval process before it affects balances in approved groups.
- **AC-009**: The system presents a clear summary of who owes whom and how much, based on resolved expense and payment data.
- **AC-010**: The implementation distinguishes customer requirements from implementation choices such as Java Swing or web delivery, without changing the original product goals.

## Key Entities

- **User**: A person with an account who belongs to one or more groups and has personal expense and balance information.
- **Group**: A shared collection of users that tracks group expenses and settlement behavior.
- **Expense**: A recorded financial event with amount, date, description, participants, split method, and optional receipt.
- **Payment**: A recorded settlement transaction that reduces or clears debt between users.
- **Notification**: A message indicating a relevant event such as a newly created expense or approval request.
- **Approval Record**: A review decision indicating whether an expense is approved, rejected, or queued for correction.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can create an account and join a group in under five minutes without assistance.
- **SC-002**: A group member can create and save an expense and see the correct share reflected in balances without manual recalculation.
- **SC-003**: At least 95% of tested expense and payment scenarios yield the expected balances in validation.
- **SC-004**: Users can generate a valid report for a date range and correctly identify the total expenses, payments, and current balances in that period.
- **SC-005**: Human reviewers can confirm that each requirement is traceable to a user need and implementation choices are documented separately.

## Assumptions

- Users are expected to access the system through a browser-first experience, while a Java Swing version may be used as a subset implementation for a class project.
- At least one group member will typically create and maintain shared expenses for the group.
- Expense reimbursement or tax treatment is out of scope unless otherwise specified by stakeholders.
- The system will use a standard approach to secure user access and prevent unauthorized viewing of shared balances.
- A receipt image is optional and may be stored with the expense record or linked if the platform supports it.

## Open Questions

- **OQ-001**: Should notifications be limited to in-app alerts, or must they also support email or push delivery?
- **OQ-002**: Is every expense required to go through approval, or only certain categories or higher-value expenses?
- **OQ-003**: Are receipt images part of the mandatory MVP, or should they be delayed to a later release?
- **OQ-004**: Should payment settlements be recorded only as simple confirmations, or should they support partial payments and multiple settlement histories?

## Requirement Traceability Summary

- User accounts: RI-001, FR-001, AC-001
- Group management: RI-002, FR-002, FR-003, AC-002
- Expense creation: RI-003, RI-004, FR-004, FR-005, FR-006, FR-007, AC-003, AC-004
- Notifications: RI-005, FR-008, AC-007
- Approval workflow: RI-006, FR-009, AC-008
- Balance tracking: RI-007, FR-010, AC-009
- Payment tracking: RI-008, FR-011, AC-005
- Reporting: RI-009, FR-012, FR-013, AC-006
- Platform statement: RI-010, NFR-006
- Implementation-choice separation: FR-016, AC-010
