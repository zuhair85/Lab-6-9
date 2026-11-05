# Domain model

## Concepts and relations

`User` has unique normalized username/email and credential hash. `Group` has members via `Membership` (pending/confirmed/left and role). Expenses require confirmed membership for payer and each participant. `Expense` belongs to a group and records creator, payer, currency, amount, incurred date, description, split method, shares, optional receipt reference, approval state and version. Creator is payer by default. FR-007 also says another payer may be explicitly selected; clarification only establishes default, so whether alternate payer is available remains an MVP policy question.

A `Share` is a nonnegative amount for one participant and shares sum exactly to expense total. For each non-payer participant, create obligation to payer for their share; payer's own share is not owed to self. If payer is excluded from participant set, allocation semantics are undefined by source and need a decision. `Approval` records reviewer, decision, timestamp, rationale and expense version. `Notification` is an in-app record. `Payment` records sender, recipient, amount, currency and status. `Reconciliation` confirms payment (or portion) against obligations. Append-only `AuditEvent` captures actor/action and aggregate reference.

## Invariants and money

All monetary values use Java `BigDecimal`, constructed from decimal strings, never binary floating point. Require positive expense/payment amounts, explicit currency and scale policy. Currency precision/rounding mode are unspecified; propose currency metadata and explicit scale validation, requiring review. For cent currencies, round each share to cents using an explicitly selected mode (proposal: HALF_UP), then assign `total - sum(previous rounded shares)` to the final stable participant order. For other currencies use approved currency precision. Equal splits use exact division then same residual rule. Percentage inputs are nonnegative and total exactly 100%; otherwise reject with clear field validation. Persist calculated shares as immutable snapshots.

Balances are reproducible from approved expenses less reconciled settlements. Pending/rejected expenses and recorded-but-unreconciled payments do not affect effective balances. Correct history through reversal/amendment events, never destructive edits.

## States and balance semantics

Expense: `DRAFT → SUBMITTED → APPROVED | REJECTED`; corrections use a new revision/resubmission (proposal). Approval activates obligations. Whether every expense needs approval, who may approve, and number of reviewers remain open. Payment: `RECORDED → PENDING_CONFIRMATION → RECONCILED`; `DISPUTED`/`VOIDED` need audited policy. Recording retains history but leaves balance unchanged. Reconciliation applies confirmed allocations, potentially partial; partial, overpayment and dispute policy require decisions. Membership: `PENDING → CONFIRMED → LEFT`; preserve historical membership for ledger interpretation.

Balance is a projection, not manually edited. Derive payer-credit/participant-debt from approved shares and apply reconciled allocations. Pairwise balances are primary; any netting for display is a presentation choice and must preserve underlying obligations. Include as-of time.
