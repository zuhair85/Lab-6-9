# Data design

Logical relational schema proposal; database and SQL dialect remain unselected. Use primary/foreign keys, DECIMAL/NUMERIC for money, explicit currency, no float.

| Table | Key columns and constraints |
|---|---|
| users | id PK, normalized username/email UNIQUE, password_hash, status, created_at |
| groups | id PK, name, created_by FK users, created_at, version |
| memberships | group_id/user_id FKs, status, role, joined_at; composite PK; index(user_id,status) |
| expenses | id PK, group_id/creator_id/payer_id FKs, amount NUMERIC, currency, occurred_at, description, split_method, status, version; index(group_id,occurred_at,status) |
| expense_shares | id PK, expense_id and participant_id FKs, percentage nullable, amount NUMERIC; UNIQUE(expense_id,participant_id) |
| receipts | id PK, expense_id FK UNIQUE, storage_key, media_type, size_bytes, content_hash, created_at |
| approvals | id PK, expense_id/reviewer_id FKs, decision, rationale, expense_version, decided_at |
| notifications | id PK, recipient_id/group_id FKs, event_type, aggregate_id, read_at, created_at; recipient/read index |
| payments | id PK, group_id/payer_id/payee_id FKs, amount, currency, status, recorded_at, version |
| obligations | id PK, expense_id/debtor_id/creditor_id FKs, amount, currency; rebuildable projection |
| payment_allocations | id PK, payment_id/obligation_id FKs, amount; sums bounded transactionally |
| audit_events | id PK, nullable actor FK, aggregate type/id, action, occurred_at, correlation_id, reference payload; append-only |

User↔group is many-to-many through membership; group has many expenses/payments; expense has many shares/approvals and optional receipt; payment has many allocations. Enforce positive amounts, valid statuses, no self-obligation, one share per participant, identity uniqueness and confirmed membership at submission. Cross-row sums and membership status need transactional application validation and database constraints where practical.

## Transactions and concurrency

Expense submission atomically validates group/membership, calculates shares, persists submitted expense/share snapshot/audit and notification records. Approval checks version and authorization, appends decision and effective ledger event atomically. Payment recording persists pending payment and audit only. Reconciliation locks payment and obligations in stable ID order, verifies remaining amounts and atomically writes allocations/status/audit. Use optimistic versions or row locks and proposed idempotency keys. Reports read a consistent snapshot. Cached balances must be rebuildable from immutable financial events. Financial rows are never hard-deleted.

## Receipts

Storage is unresolved: database blob versus private object/file store. Proposed opaque storage reference with private authorization, size/type limits, malware scanning and retention policy; none is source-approved. Keep metadata/hash, avoid public URLs, and decide deletion/privacy retention with stakeholders before production.
