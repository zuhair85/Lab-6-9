/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs');
const path = require('node:path');
const { createHash, randomUUID } = require('node:crypto');
const Database = require('better-sqlite3');

const databasePath = path.join(__dirname, 'dev.db');
const migrationsPath = path.join(__dirname, 'migrations');
const database = new Database(databasePath);
database.pragma('foreign_keys = ON');
database.exec(`CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "checksum" TEXT NOT NULL,
  "finished_at" DATETIME,
  "migration_name" TEXT NOT NULL,
  "logs" TEXT,
  "rolled_back_at" DATETIME,
  "started_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "applied_steps_count" INTEGER NOT NULL DEFAULT 0
)`);

const applied = database.prepare('SELECT migration_name FROM "_prisma_migrations" WHERE finished_at IS NOT NULL');
const markApplied = database.prepare('INSERT INTO "_prisma_migrations" (id, checksum, finished_at, migration_name, applied_steps_count) VALUES (?, ?, CURRENT_TIMESTAMP, ?, 1)');
for (const migrationName of fs.readdirSync(migrationsPath).sort()) {
  const migrationFile = path.join(migrationsPath, migrationName, 'migration.sql');
  if (!fs.existsSync(migrationFile) || applied.all().some((row) => row.migration_name === migrationName)) continue;
  const sql = fs.readFileSync(migrationFile, 'utf8');
  database.transaction(() => {
    database.exec(sql);
    markApplied.run(randomUUID(), createHash('sha256').update(sql).digest('hex'), migrationName);
  })();
  console.log(`Applied ${migrationName}`);
}
database.close();
