/**
 * Plain forward-only migration runner.
 *
 * Reads `infra/migrations/*.sql` in lexical order and applies any not yet
 * recorded in `_migrations`. Run via:
 *
 *   pnpm --filter @creatordeck/api migrate
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { Client } from "pg";
import { config } from "../config";

const MIGRATIONS_DIR = path.resolve(__dirname, "../../../../infra/migrations");

async function main(): Promise<void> {
  const client = new Client({ connectionString: config.DATABASE_URL });
  await client.connect();

  await client.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      name        TEXT PRIMARY KEY,
      applied_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  const applied = new Set<string>(
    (await client.query<{ name: string }>(`SELECT name FROM _migrations ORDER BY name`))
      .rows.map((r) => r.name),
  );

  const files = (await readdir(MIGRATIONS_DIR))
    .filter((f) => f.endsWith(".sql"))
    .sort();

  let count = 0;
  for (const file of files) {
    if (applied.has(file)) continue;
    const fullPath = path.join(MIGRATIONS_DIR, file);
    const sql = await readFile(fullPath, "utf8");
    console.info(`[migrate] applying ${file}`);
    try {
      await client.query("BEGIN");
      await client.query(sql);
      await client.query(`INSERT INTO _migrations (name) VALUES ($1)`, [file]);
      await client.query("COMMIT");
      count += 1;
    } catch (err) {
      await client.query("ROLLBACK").catch(() => undefined);
      console.error(`[migrate] failed on ${file}`, err);
      process.exit(1);
    }
  }

  await client.end();
  console.info(`[migrate] OK — ${count} new migration(s) applied, ${applied.size + count} total.`);
}

main().catch((err) => {
  console.error("[migrate] fatal", err);
  process.exit(1);
});
