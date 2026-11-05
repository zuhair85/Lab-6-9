# Security and quality

## Security and privacy

Use vetted adaptive salted password hashing through replaceable port; never store plaintext or reversible passwords. Secure sessions, transport and account recovery need delivery-specific design; no identity provider is assumed. Authorize every group, expense, receipt, notification, payment and report access; enforce group isolation in use cases and persistence queries. Use scope-safe errors. Validate inputs and protect receipt uploads against spoofed types, oversized files and malicious content. Store receipts privately and serve only after authorization. Minimize audit payloads and define retention with stakeholders.

Audit financially significant actor/action/time/target/version/outcome; keep audit append-only and access-controlled. Never log passwords, secrets or receipt content. Threat modeling and security review remain before deployment.

## Quality attributes

- Financial integrity: BigDecimal/decimal storage, exact share sums and reproducible ledger; verify deterministic edge cases.
- Reliability: atomic approval/reconciliation, idempotent retries and concurrency checks are proposed.
- Authorization/privacy: group-scoped access; test cross-group denial.
- Maintainability: UI/domain separation and modular boundaries per Constitution.
- Usability: clear validation and understandable who-owes-whom display (NFR-004), no numeric target specified.
- Multi-user correctness: transactions and conflict outcomes; workload/scale target unspecified.
- Web usability: NFR-006 requires browser-first experience; Swing does not demonstrate it.

No availability, latency, retention, upload-size or scale targets appear in sources. Human review of financially significant behavior is mandatory (NFR-007/Constitution).
