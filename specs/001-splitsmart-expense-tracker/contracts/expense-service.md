# Conceptual Service Contracts

Status: Draft design proposal only; not approved API or UI requirements.

## Scope

These contracts are conceptual application-layer interfaces. They describe the responsibilities and information exchanged at the service boundary rather than final REST endpoints or UI screens.

## Identity and access

### `AccountService.register`

Purpose: create a new user account and secure credentials.

Request:

```json
{
  "username": "jdoe",
  "email": "jdoe@example.com",
  "password": "********",
  "displayName": "Jane Doe"
}
```

Result:

```json
{
  "userId": "usr_123",
  "status": "created",
  "requiresVerification": false
}
```

Errors:
- duplicate user identity
- invalid email or weak password policy
- missing required personal data

### `AuthenticationService.authenticate`

Purpose: verify username-or-email and password.

Input:

```json
{
  "usernameOrEmail": "jdoe@example.com",
  "password": "********"
}
```

Output:

```json
{
  "authenticated": true,
  "userId": "usr_123",
  "sessionToken": "opaque-token"
}
```

## Group and membership

### `GroupService.createGroup`

Request:

```json
{
  "name": "Apartment 2B",
  "createdByUserId": "usr_123",
  "memberUserIds": ["usr_456", "usr_789"]
}
```

Result:

```json
{
  "groupId": "grp_001",
  "membershipCount": 3
}
```

Errors:
- duplicate group name if required by policy
- invalid or unconfirmed member ids
- unauthorized user action

## Expense submission and validation

### `ExpenseService.submitExpense`

Purpose: validate, calculate splits, and store an expense ready for approval.

Request:

```json
{
  "groupId": "grp_001",
  "payerUserId": "usr_123",
  "createdByUserId": "usr_123",
  "description": "Groceries",
  "expenseDate": "2026-11-05",
  "amount": "125.00",
  "currency": "USD",
  "splitMethod": "EQUAL",
  "participantUserIds": ["usr_123", "usr_456", "usr_789"]
}
```

Result:

```json
{
  "expenseId": "exp_101",
  "status": "submitted",
  "splits": [
    { "participantUserId": "usr_123", "shareAmount": "41.67" },
    { "participantUserId": "usr_456", "shareAmount": "41.67" },
    { "participantUserId": "usr_789", "shareAmount": "41.66" }
  ]
}
```

Validation and domain errors:
- invalid monetary amount
- zero or negative amount
- percentage total does not equal 100%
- user not confirmed in group
- unapproved expense cannot affect balances

### `ExpenseService.submitPercentageSplit`

Purpose: validate percentage-based allocation and enforce the 100% rule.

Request:

```json
{
  "groupId": "grp_001",
  "payerUserId": "usr_123",
  "participantPercentages": {
    "usr_123": 50,
    "usr_456": 25,
    "usr_789": 25
  },
  "amount": "480.00"
}
```

Result:

```json
{
  "expenseId": "exp_102",
  "status": "submitted",
  "shares": [
    { "participantUserId": "usr_123", "shareAmount": "240.00" },
    { "participantUserId": "usr_456", "shareAmount": "120.00" },
    { "participantUserId": "usr_789", "shareAmount": "120.00" }
  ]
}
```

## Approval and finance

### `ApprovalService.reviewExpense`

Request:

```json
{
  "expenseId": "exp_101",
  "reviewerUserId": "usr_456",
  "decision": "APPROVE",
  "reason": "Expense matches group policy"
}
```

Result:

```json
{
  "expenseId": "exp_101",
  "status": "approved",
  "balanceEffective": true
}
```

### `PaymentService.recordPayment`

Purpose: create a payment ledger event while retaining balance history until reconciliation.

Request:

```json
{
  "groupId": "grp_001",
  "payerUserId": "usr_456",
  "payeeUserId": "usr_123",
  "amount": "75.00",
  "currency": "USD",
  "note": "March rent share"
}
```

Result:

```json
{
  "paymentId": "pmt_008",
  "status": "recorded",
  "balanceStatus": "active-until-reconciliation"
}
```

### `SettlementService.reconcilePayment`

Purpose: confirm settlement and apply the payment to the active debt ledger.

Request:

```json
{
  "paymentId": "pmt_008",
  "confirmedByUserId": "usr_123",
  "settlementAmount": "75.00"
}
```

Result:

```json
{
  "paymentId": "pmt_008",
  "status": "reconciled",
  "activeBalanceUpdated": true
}
```

## Reporting and queries

### `BalanceService.getGroupSummary`

Purpose: return the net positions for a group.

Output:

```json
{
  "groupId": "grp_001",
  "balances": [
    { "userId": "usr_123", "net": "-120.00" },
    { "userId": "usr_456", "net": "60.00" },
    { "userId": "usr_789", "net": "60.00" }
  ]
}
```

### `ReportingService.generateReport`

Purpose: produce date-range summaries of expenses, payments, and balances.

Request:

```json
{
  "groupId": "grp_001",
  "fromDate": "2026-10-01",
  "toDate": "2026-10-31",
  "includePayments": true,
  "includeBalances": true
}
```

Result:

```json
{
  "groupId": "grp_001",
  "totalExpenses": "1280.00",
  "totalPayments": "975.00",
  "balances": [
    { "userId": "usr_123", "net": "-200.00" }
  ]
}
```

## Notes

- These contracts deliberately avoid inventing final REST paths, database schemas, or UI screens.
- They are intended to guide implementation planning and review, not to replace stakeholder-approved product requirements.
