# Data Model and Domain Semantics

Status: Draft architecture proposal for review; no implementation or schema is considered approved.

## Core design principles

- Customer requirements and clarified decisions are the source of truth; implementation details remain separate.
- Domain logic owns rules and invariants; persistence and UI only adapt to that domain.
- Monetary values use BigDecimal with explicit currency precision and deterministic rounding.
- Financial events are auditable and must retain historical evidence even when the balance remains active until reconciliation.

## Entity summary

| Entity | Purpose | Key relationships |
|---|---|---|
| User | Account owner and authenticated actor | Belongs to many groups via membership |
| Group | Shared financial context | Owns members, expenses, notifications, payments |
| GroupMembership | Confirms membership status and role | Links User to Group |
| Expense | Financial event recorded in a group | Owned by a group, payer, participants, approval records |
| ExpenseSplit | Per-participant share or percentage allocation | Child of an expense |
| Receipt | Optional evidence attachment | Child of an expense |
| ApprovalRecord | Review decision made before balance impact | Child of an expense |
| Notification | User-visible message for a relevant event | Related to group, expense, assignee, status |
| Payment | Recorded settlement attempt or payment event | Linked to group, debtor, creditor, reconciliation |
| Reconciliation | Confirms settlement of a recorded payment | References payment and resulting balances |
| AuditEvent | Immutable record of domain change | Linked to actor and entity |

## Entity definitions

### User

- `id`: stable unique identifier
- `username`: unique login name
- `email`: unique login/notification address
- `passwordHash`: secure salted hash, not plain text
- `status`: active/inactive/locked
- `createdAt`: account creation timestamp

Invariants:
- Each user has one unique identity.
- Authenticated identity must be checked against role and group access rules.

### Group

- `id`
- `name`
- `description` (optional)
- `createdByUserId`
- `createdAt`
- `status`: active/archived

Invariants:
- Group membership is explicit; users cannot participate in expenses unless they are confirmed members.
- Access control is scoped to group membership and administrative roles.

### GroupMembership

- `id`
- `groupId`
- `userId`
- `status`: invited / confirmed / removed / suspended
- `role`: member / admin / owner
- `joinedAt`

Invariants:
- A user cannot contribute to an expense unless membership status is `confirmed`.
- Membership status must be reflected in authorization checks before expense creation and approval actions.

### Expense

- `id`
- `groupId`
- `payerUserId`
- `createdByUserId`
- `description`
- `expenseDate`
- `amount`: BigDecimal
- `currency`: ISO currency code
- `splitMethod`: equal / percentage / custom (if later supported)
- `status`: draft / submitted / approved / rejected / archived
- `approvedAt` / `rejectedAt` optional
- `receiptId` optional

Invariants:
- Expense amount must be greater than zero.
- Participants must be confirmed group members.
- Percentage totals must equal exactly 100.00 before acceptance.
- Equal split or percentage split values are computed using exact decimal arithmetic and the residual-cent rule.

### ExpenseSplit

- `id`
- `expenseId`
- `participantUserId`
- `shareAmount`: BigDecimal
- `percentage`: BigDecimal (nullable when equal split)
- `isResidualRecipient`: boolean, true only for final participant in equal/percentage residual assignment

Invariants:
- Sum of `shareAmount` values equals the total expense amount.
- For percentage split, each participant percentage is valid and the total equals 100% exactly.
- The final participant may receive the residual cent(s) to preserve exact total; this is deterministic and auditable.

### Receipt

- `id`
- `expenseId`
- `storageKey`
- `mimeType`
- `checksum`
- `uploadedAt`

Invariants:
- Receipt is optional, but when present it is associated with exactly one expense.
- Files must be treated as sensitive content and protected by access control.

### ApprovalRecord

- `id`
- `expenseId`
- `reviewerUserId`
- `decision`: approved / rejected / needs-change
- `reason` optional
- `reviewedAt`

Invariants:
- Approval is not the same as payment settlement.
- An approved expense is allowed to affect balances only after the approval policy and validation rules are satisfied.
- Rejection prevents balance impact until the expense is corrected and resubmitted.

### Notification

- `id`
- `recipientUserId`
- `groupId`
- `expenseId` optional
- `type`: new_expense / approval_required / payment_recorded / reconciliation_confirmed
- `status`: unread / read / dismissed
- `messageTemplate`
- `createdAt`

Invariants:
- Default channel is in-app; other channels are future extension features.
- Notifications must be tied to an actionable event to remain auditable.

### Payment

- `id`
- `groupId`
- `payerUserId`
- `payeeUserId`
- `amount`: BigDecimal
- `currency`
- `recordedAt`
- `status`: recorded / partially_applied / reconciled / disputed
- `reference` optional

Invariants:
- A payment record alone does not automatically settle the underlying balance.
- Payment history is preserved even when reconciliation has not occurred.
- Payment amount may be partial or overpayment depending on product policy; the implementation must validate and record the exact outcome.

### Reconciliation / Settlement

- `id`
- `paymentId`
- `confirmedByUserId`
- `settlementAmount`: BigDecimal
- `confirmedAt`
- `notes` optional

Invariants:
- Reconciliation is the action that confirms a payment’s effect on active balances.
- The unpaid or unsettled state remains active until the separate reconciliation step.

### AuditEvent

- `id`
- `entityType`
- `entityId`
- `actorUserId`
- `action`
- `beforeState` optional JSON
- `afterState` optional JSON
- `occurredAt`

Invariants:
- Immutable or append-only records are preferred for financial actions.
- All balance-affecting events must be traceable back to a human and a domain action.

## Domain rules and lifecycle semantics

### Membership and eligibility

- All participants in an expense must already be in `GroupMembership` with status `confirmed`.
- Non-members or pending members are rejected before the expense is saved.
- This acts as both a business rule and a security boundary.

### Expense lifecycle

1. Draft or create expense.
2. Validate amount > 0 and share logic.
3. Restrict participants to confirmed group members.
4. Submit for approval if required by group policy.
5. Approved expense becomes balance-effective.
6. Rejected expense remains in history but does not change balances.

### Payment and reconciliation semantics

- Payment recording and settlement are separate steps.
- Recorded payment enters the ledger but leaves the balance active until reconciliation confirms settlement.
- Reconciliation must be explicit and auditable.
- This prevents silent or premature balance clearing and preserves historical traceability.

### Financial arithmetic rules

- Use `BigDecimal` for all monetary fields.
- Keep a consistent currency precision and rounding strategy for display and ledger values.
- Equal/percentage split rounding uses the clarified rule: round to cents, then allocate any residual cents to the final participant in the participant list.
- Validate invalid amounts and invalid percentage totals before persistence.

## Referential and authorization constraints

- User-to-Group: Many-to-many through GroupMembership; membership role and status are explicit.
- Group-to-Expense: One-to-many.
- Expense-to-Split: One-to-many.
- Expense-to-ApprovalRecord: One-to-many.
- Expense-to-Receipt: One-to-one or many-to-one depending on receipt history requirements; a practical design should allow a current receipt record plus archived copies if needed.
- Payment-to-Reconciliation: One-to-many if multiple settlement confirmations are supported.
- Group-to-Notification: One-to-many.
- Group-to-AuditEvent: One-to-many.

Authorization constraints:
- Users can only view/edit members and approvals for groups where they are authorized.
- Only confirmed group members or designated admins may create or approve expenses in a group.
- Receipt access is restricted to authorized group members or owners involved in the expense.

## Open design assumptions

- The project does not yet specify a database provider or whether a single default currency will be required from day one.
- Payment details for partial settlement or overpayment rules are intentionally left as product decisions because the requirement remains underspecified in the spec’s open questions.
- A desktop prototype may reuse the same domain types but is not part of the customer’s web requirement.
