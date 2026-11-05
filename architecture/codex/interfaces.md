# Application interfaces

Technology-neutral proposals, not approved endpoints. Commands carry trusted actor context, aggregate/group ID, inputs, expected version and idempotency key. Queries are read-only and group-scoped. Browser/Swing adapters map forms to these contracts; they cannot bypass use cases.

| Use case | Input | Outcome |
|---|---|---|
| RegisterAccount | username, email, password | account ID; validation/duplicate |
| Authenticate | username-or-email, password | session principal; generic credential failure |
| CreateGroup / AddMember / ConfirmMembership | actor, group, member | state; forbidden/conflict |
| SubmitExpense | actor, group, amount/currency/date/description, split, participants, receipt, version/key | ID, shares and submitted state; validation/forbidden/conflict/storage error |
| DecideExpense | actor, expense, approve/reject, rationale, version | state/effective event; forbidden/stale/invalid transition |
| GetBalances / GetReport | actor, group, filters/as-of | scoped projection; forbidden/invalid range |
| RecordPayment | actor, group, payee, amount/currency, key | pending payment; validation/conflict |
| ReconcilePayment | actor, payment, allocations, evidence reference, version | reconciled state; forbidden/over-allocation/stale |
| ListNotifications / MarkRead | actor, filters/notification ID | scoped records; not found |

Presentation may perform usability checks; application validates authorization, shape and workflow; domain validates invariants; persistence enforces uniqueness, references and concurrency. Never trust client-supplied identity, shares, balances, roles or reconciliation outcome. No endpoint path/protocol is approved.
