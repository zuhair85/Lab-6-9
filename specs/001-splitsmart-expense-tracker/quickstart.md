# Quickstart Validation Guide

Status: Implementation guidance only; no unimplemented commands are claimed to exist in this repository.

## Purpose

This guide explains how a future implementation or reviewer should validate that the SplitSmart design satisfies the product requirements without suggesting that the app is already built.

## Reviewer checklist

1. Confirm the customer requirement still governs the implementation.
   - `UserRequirement.md` is the customer source of truth.
   - The clarified feature spec remains authoritative for acceptance criteria and clarified decisions.

2. Confirm the architecture boundary.
   - The web application is the primary product.
   - A Java Swing desktop path is an explicitly labeled academic subset and not a substitute for the web requirement.

3. Validate the core financial semantics.
   - Amounts and shares are represented using `BigDecimal`.
   - Equal and percentage splits are calculated deterministically.
   - Residual cents are allocated to the final participant.
   - Invalid amounts and percentage totals not equal to 100% are rejected.

4. Validate access and authorization rules.
   - Only confirmed group members are eligible for expense participation.
   - Action boundaries should prevent unauthorized cross-group access.

5. Validate payment lifecycle semantics.
   - Recorded payments remain in history.
   - Balance activity remains until reconciliation confirms settlement.

6. Validate approval and reporting behavior.
   - Approval-related actions are separated from payment actions.
   - Reports must be based on approved, balance-effective expense data and recorded payments.

## Proposed validation scenarios

### Scenario A: Create account and group

- Preconditions: No account exists for the user.
- Steps: create an account, login, create a group, add confirmed members.
- Expected outcomes: user can access personal data only for their own account; group members can access the group and track its balances.

### Scenario B: Submit expense with equal split

- Preconditions: group exists and participants are confirmed members.
- Steps: create an expense with amount and 3 participants, split equally.
- Expected outcomes: each share is calculated using BigDecimal; residual cents assigned to the final participant; total equals original amount exactly.

### Scenario C: Submit expense with percentage split

- Preconditions: group exists and percentages are known.
- Steps: submit 40/35/25 split with valid amounts.
- Expected outcomes: percentage total equals 100%; amounts are exactly computed and the sum equals total expense value.

### Scenario D: Reject invalid percentage split

- Preconditions: an expense is being created.
- Steps: enter percentages that sum to 90% or 101%.
- Expected outcomes: validation error is presented and the expense is not persisted.

### Scenario E: Payment entry and reconciliation

- Preconditions: an outstanding balance exists.
- Steps: record a payment, then reconcile it through the separate confirmation step.
- Expected outcomes: payment history is retained; balance remains active until the reconciliation step confirms settlement; the resulting balance reflects the reconciliation state.

### Scenario F: Approval flow

- Preconditions: approval is required for the group.
- Steps: create an expense, submit it for review, approve or reject it.
- Expected outcomes: approved expenses affect balances; rejected expenses remain non-effective until resubmitted or corrected.

## Future implementation validation commands

The repository does not yet contain a project implementation, so these commands are examples of the validation path to be used after implementation is created under the constitutional Java 21 + Maven + JUnit 5 standard. They are not a claim that the app currently runs:

```bash
mvn test
mvn -Dtest=ExpenseSplitCalculatorTest test
mvn -Dtest=ApprovalWorkflowTest test
mvn -Dtest=PaymentReconciliationTest test
```

The real implementation should be validated using the smallest practical JUnit 5 coverage for each requirement and acceptance criterion, especially around money calculations, membership validation, approval status, and payment reconciliation.

## Traceability check to perform during implementation review

- RI-001 to FR-001 / AC-001
- RI-002 to FR-002 / FR-003 / AC-002
- RI-003 to FR-004 / FR-005 / FR-006 / FR-007 / AC-003 / AC-004
- RI-005 to FR-009 / AC-007
- RI-006 to FR-010 / AC-008
- RI-007 to FR-011 / AC-009
- RI-008 to FR-012 / AC-005
- RI-009 to FR-013 / FR-014 / AC-006
- RI-010 to NFR-006 / AC-010

If any item does not trace to the implementation or the requirements, the design should be revised before acceptance.
