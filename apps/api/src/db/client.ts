/**
 * Postgres connection pool with a typed query helper.
 * Hand-written SQL is the rule; no ORM.
 */
import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from "pg";
import { config } from "../config";

export const pool = new Pool({
  connectionString: config.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

pool.on("error", (err) => {
  console.error("[pg] idle client error", err);
});

/**
 * Run a parameterized query. Throws on connection / SQL errors.
 */
export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: ReadonlyArray<unknown>,
): Promise<QueryResult<T>> {
  const start = Date.now();
  try {
    const res = await pool.query<T>(text, params as unknown[]);
    if (config.NODE_ENV !== "production") {
      const ms = Date.now() - start;
      if (ms > 250) {
        console.warn(`[pg] slow query ${ms}ms`, text.slice(0, 100));
      }
    }
    return res;
  } catch (err) {
    console.error("[pg] query error", { text: text.slice(0, 200), err });
    throw err;
  }
}

/**
 * Run multiple statements inside a transaction.
 */
export async function withTransaction<T>(
  fn: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK").catch(() => undefined);
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Close pool. Call from graceful shutdown handlers.
 */
export async function closePool(): Promise<void> {
  await pool.end();
}
