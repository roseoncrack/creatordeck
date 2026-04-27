-- ============================================================
-- 0004_niche_taxonomy.sql
-- Niche tree with ltree paths for fast subtree queries.
-- ============================================================

CREATE TABLE IF NOT EXISTS niche_taxonomy (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id      UUID REFERENCES niche_taxonomy(id) ON DELETE RESTRICT,
  slug           TEXT NOT NULL,
  label          TEXT NOT NULL,
  description    TEXT,
  level          INT NOT NULL,
  path           ltree NOT NULL,
  sort_order     INT NOT NULL DEFAULT 0,
  is_active      BOOLEAN NOT NULL DEFAULT TRUE,
  icon           TEXT,
  search_aliases TEXT[] NOT NULL DEFAULT '{}',
  creator_count  INT NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (parent_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_niche_path_gist  ON niche_taxonomy USING GIST (path);
CREATE INDEX IF NOT EXISTS idx_niche_path_btree ON niche_taxonomy USING BTREE (path);
CREATE INDEX IF NOT EXISTS idx_niche_parent     ON niche_taxonomy(parent_id);
CREATE INDEX IF NOT EXISTS idx_niche_aliases    ON niche_taxonomy USING GIN (search_aliases);
CREATE INDEX IF NOT EXISTS idx_niche_active     ON niche_taxonomy(is_active) WHERE is_active;
