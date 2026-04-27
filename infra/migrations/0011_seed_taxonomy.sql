-- ============================================================
-- 0011_seed_taxonomy.sql
-- Placeholder. The actual taxonomy seed is generated from
-- packages/taxonomy/src/tree.ts and run via:
--
--   pnpm db:seed
--
-- See packages/taxonomy/src/seed.ts for the upsert script.
-- This migration just no-ops so the migration runner sees 0001..0011
-- as a contiguous set.
-- ============================================================

DO $$
BEGIN
  RAISE NOTICE 'Run `pnpm db:seed` to populate niche_taxonomy from packages/taxonomy.';
END $$;
