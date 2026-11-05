# Testing strategy and traceability

Plan only; no tests were run. Follow Constitution: Maven, JUnit 5, test-first changes, human review. Proposed suites: domain unit tests for split/ledger/state invariants; repository and transaction integration tests; authorization isolation tests; workflow end-to-end tests for registration→group→expense→approval→balance→payment→reconciliation→report. Use deterministic fixtures and a fake clock. Test exact decimal edge cases, zero/negative inputs, unequal cents, percentage boundary/precision, rounding residual recipient, payer included/excluded, duplicate retries, stale versions, concurrent reconciliation, partial/overpayment policy once decided, rejection, reversal, and pending payment not affecting balance. No test execution is claimed.

## Traceability matrix

Architecture elements are abbreviated: ID identity; GR group/membership; EX expense/share/approval; NT notifications; LG ledger/payment/reconciliation/audit; RP reporting; UI web/Swing boundary. Each row gives design mapping and verification approach.

| ID | Architecture/domain/workflow | Verification approach |
|---|---|---|
| RI-001 | ID; account-scoped access | register/login and cross-account authorization tests |
| RI-002 | GR; group membership lifecycle | create/manage group and membership tests |
| RI-003 | EX; expense details/receipt | field validation and receipt access tests |
| RI-004 | EX; participant share snapshot | confirmed-member and obligation tests |
| RI-005 | NT; in-app group event | recipient, scope, persistence tests |
| RI-006 | EX approval gates LG | approval/rejection balance-effect workflow tests |
| RI-007 | LG; pairwise obligation projection | ledger reconstruction and net balance tests |
| RI-008 | LG; payment/reconciliation | pending-vs-reconciled and allocation tests |
| RI-009 | RP; date/group-filtered report | totals, boundaries, scope and consistency tests |
| RI-010 | UI web target; Swing explicitly subset | deployment/UI acceptance evidence; Swing cannot pass this requirement |
| FR-001 | ID | uniqueness, password handling, login tests |
| FR-002 | GR | authorized group CRUD tests |
| FR-003 | GR | member add/confirm and role tests |
| FR-004 | EX | valid expense submission and required-field tests |
| FR-005 | EX split policies | equal/percentage examples and property checks |
| FR-006 | EX validation | 100%, under/over and precision rejection tests |
| FR-007 | EX payer default; alternate payer unresolved | default and policy-decision tests; confirm alternate payer scope |
| FR-008 | EX receipt port | absent/valid/corrupt/unauthorized receipt tests |
| FR-009 | NT | member notification event tests |
| FR-010 | EX approval state | only approved expenses effective tests |
| FR-011 | LG | pairwise projection reconstruction tests |
| FR-012 | LG payment lifecycle | history retained; pending no effect; reconciliation updates tests; conflict with AC-005 flagged |
| FR-013 | RP | summary/detail totals tests |
| FR-014 | RP date filters | inclusive boundaries, empty/future policy tests |
| FR-015 | ID/GR/EX/LG access checks | cross-group read/write denial tests |
| FR-016 | LG audit/reversal | reconstruct and audit sequence tests |
| FR-017 | UI boundary/docs | review checklist for product vs implementation labels |
| NFR-001 | LG deterministic projection | repeated/reordered event and reconciliation tests |
| NFR-002 | BigDecimal policy | code review/static inspection plus precision edge cases |
| NFR-003 | access isolation | authorization/security tests |
| NFR-004 | UI clear balances/errors | usability review; no measurable target specified |
| NFR-005 | transaction/version handling | concurrent operations and rollback tests; load target unresolved |
| NFR-006 | UI web target | browser workflow acceptance; Swing excluded |
| NFR-007 | human review gate | documented approval evidence for financially significant changes |
| AC-001 | ID | account creation/login and isolation test |
| AC-002 | GR | group plus several members test |
| AC-003 | EX/LG | submit and verify obligation shares; approval precondition needs alignment |
| AC-004 | EX | reject percentage total !=100 before record |
| AC-005 | LG | reconcile then reduce/clear; recording alone must not reduce; spec conflict |
| AC-006 | RP | date-range report contents test |
| AC-007 | NT | relevant member receives attention notification |
| AC-008 | EX | approval before balance activation |
| AC-009 | LG | explain pairwise debt from resolved data |
| AC-010 | UI/docs | review web vs Swing distinction |
| SC-001 | ID/GR | timed onboarding usability study; protocol/target clarification needed |
| SC-002 | EX/LG | create expense and verify correct balance automatically |
| SC-003 | testing plan | acceptance dataset and expected >=95% scenario result; denominator/sample unspecified |
| SC-004 | RP | report scenario review identifies totals and current balance |
| SC-005 | traceability/review | human review confirms chain and choice labels |

Some acceptance language describes immediate balance changes on saved expense, while approval requirements gate balance effects; define the approval policy and status semantics before acceptance. See `decisions-risks.md`.
