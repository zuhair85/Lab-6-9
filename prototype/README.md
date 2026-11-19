# SplitSmart prototype

A responsive expense-sharing demo built with the existing Next.js 15, React 19, TypeScript, Prisma 6, and SQLite setup. Data access stays in Next.js server routes. Amounts are persisted as integer cents; this prototype uses a seeded demo account rather than production authentication. Payment entry records a ledger event locally and does not contact a bank or payment provider.

## First-time setup

From this directory:

```bash
cp .env.example .env
npm install
npm run db:setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). `db:setup` applies a Prisma migration and runs an idempotent seed. It adds or updates the known demo records and does not delete or reset the SQLite database. SQLite is stored at `prisma/dev.db` with the example URL. To seed again after setup, run `npm run db:seed`.

`npm run db:migrate` applies checked-in SQL migrations that have not run yet. The setup runner records applied migrations in Prisma’s migration table and is safe to rerun.

If the schema changes later, create and apply a migration with `npx prisma migrate dev --name describe_change`, then run `npm run db:seed` if demo records need updating.

## Checks

```bash
npm run lint
npm run build
```

## Demo walkthrough

Use the Overview for balances, recent activity, and pending approvals. Open a group to inspect its members, expenses, and who owes whom. Add an expense with an equal or percentage split; percentage shares must total 100%. New expenses wait for review. Approve or reject them from the dashboard. Record a payment to update the group balance, then open Reports to filter approved expenses and recorded payments by date.

The demo workspace is represented by Alex Morgan (`alex@splitsmart.demo`). There is no login screen, external notification service, receipt upload, or external payment processing in this prototype.
