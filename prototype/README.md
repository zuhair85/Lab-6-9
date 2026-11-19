## SplitSmart

SplitSmart is a local shared-expense tracker built with the existing Next.js, TypeScript, and Prisma setup. Groups, members, expenses, and equal participant shares are stored in SQLite; money is stored as integer cents.

## Run locally

From the repository root:

```bash
cd prototype
npm install
cp .env.example .env
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The configured SQLite database is `prototype/prisma/dev.db`. Existing Lab 8 tables and records are retained; SplitSmart uses separate `SplitSmart*` tables in the same database.

## Verify

```bash
npm run lint
npm run build
```

Create a group, add members, and record an expense with the payer and participants selected. The group selection is remembered in the browser, and all ledger data persists in SQLite.

## Getting Started

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
