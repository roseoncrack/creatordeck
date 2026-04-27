/**
 * Seed the `niche_taxonomy` table from the typed tree in `tree.ts`.
 *
 * Idempotent: uses `ON CONFLICT (parent_id, slug) DO UPDATE` to update
 * labels/descriptions/icons/aliases without duplicating rows.
 *
 * Run with:  pnpm --filter @creatordeck/taxonomy seed
 */
import { Client } from "pg";
import { flattenTree, countNodes, NICHE_TREE } from "./tree";

const DATABASE_URL = process.env.DATABASE_URL;

async function main(): Promise<void> {
  if (!DATABASE_URL) {
    console.error("DATABASE_URL is required");
    process.exit(1);
  }

  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();

  const flat = flattenTree();
  const total = countNodes();
  console.info(`[seed] Seeding ${flat.length} niche rows (${total} expected)`);

  // Track inserted ids by path so children can resolve their parent_id.
  const idsByPath = new Map<string, string>();

  await client.query("BEGIN");
  try {
    // Sort so parents come before children (lower level first).
    flat.sort((a, b) => a.level - b.level || a.path.localeCompare(b.path));

    for (const node of flat) {
      const parentId = node.parent_path ? idsByPath.get(node.parent_path) ?? null : null;

      const result = await client.query<{ id: string }>(
        `
        INSERT INTO niche_taxonomy
          (parent_id, slug, label, description, level, path, sort_order, icon, search_aliases, is_active)
        VALUES
          ($1, $2, $3, $4, $5, $6::ltree, $7, $8, $9, TRUE)
        ON CONFLICT (parent_id, slug) DO UPDATE SET
          label          = EXCLUDED.label,
          description    = EXCLUDED.description,
          path           = EXCLUDED.path,
          level          = EXCLUDED.level,
          sort_order     = EXCLUDED.sort_order,
          icon           = EXCLUDED.icon,
          search_aliases = EXCLUDED.search_aliases,
          is_active      = TRUE,
          updated_at     = NOW()
        RETURNING id
        `,
        [
          parentId,
          node.slug,
          node.label,
          node.description ?? null,
          node.level,
          node.path,
          node.sort_order,
          node.icon ?? null,
          node.aliases,
        ],
      );

      const row = result.rows[0];
      if (!row) throw new Error(`upsert returned no row for ${node.path}`);
      idsByPath.set(node.path, row.id);
    }

    await client.query("COMMIT");
    console.info(`[seed] OK — ${idsByPath.size} nodes upserted across ${NICHE_TREE.length} roots`);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("[seed] failed:", err);
  process.exit(1);
});
