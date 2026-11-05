# Workflows

## Registration and groups

Register validates unique normalized username/email and password policy; store salted adaptive password hash via port. Login verifies credentials; delivery adapter manages session. Every use case checks group scope and role. Create group assigns creator confirmed owner/member. Adding people creates pending/confirmed membership per invitation policy (unspecified); only confirmed members can be expense participants.

## Expense and approval

1. Creator selects group, amount/currency/date/description, split, participants; payer defaults to creator. Validate authorization, positive amount, confirmed membership, participants and split.
2. Equal split divides by count. Percentage split requires exact 100%. Round at currency precision, assign residual to deterministic final participant. Invalid input returns clear field errors.
3. Optional receipt validates and stores through private port. Failure must not leave partial expense.
4. Persist submitted expense/share snapshot/audit and in-app notices for relevant members/reviewers. Recipients and whether creator receives notice are policy choices.
5. Authorized reviewer approves/rejects. Approval atomically activates obligations; rejection records reason and remains out of balance. Stale version/unauthorized reviewer fails without changes.

## Balances, reports, payment

Balance query derives approved obligations less reconciled allocations. Report applies group authorization and date filters, distinguishes pending payments from reconciled settlements. Empty/future/reversed date range policy is unspecified.

Payment recording validates group, parties, positive amount and persists `PENDING_CONFIRMATION`; balance is unchanged. Reconciliation verifies authorization/evidence, allocates confirmed amount and updates effective balance atomically. Retries are idempotent. Overpayment, partial confirmation, dispute, and multiple allocations need decisions; never silently clamp or create negative obligations.

## Errors

Typed outcomes: `UNAUTHENTICATED`, `FORBIDDEN`, scope-safe `NOT_FOUND`, `VALIDATION` with fields, `CONFLICT` for stale versions/transitions, `DEPENDENCY_FAILURE` for receipt/notification storage. Financial mutation rolls back on failure. A transactional outbox or same-database notification record is a proposal so notification failure cannot split financial state.

See `diagrams/expense-approval.puml` and `diagrams/payment-reconciliation.puml`.
