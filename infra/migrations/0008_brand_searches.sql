-- ============================================================
-- 0008_brand_searches.sql
-- Saved searches. Phase 3 wires up notifications.
-- ============================================================

CREATE TABLE IF NOT EXISTS brand_searches (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id             UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  created_by           UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,

  name                 TEXT NOT NULL,
  description          TEXT,

  filters              JSONB NOT NULL,
  sort                 TEXT NOT NULL DEFAULT 'relevance',

  notify_on_new_match  BOOLEAN NOT NULL DEFAULT FALSE,
  last_run_at          TIMESTAMPTZ,
  last_match_count     INT,

  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bs_brand
  ON brand_searches(brand_id);
CREATE INDEX IF NOT EXISTS idx_bs_notify
  ON brand_searches(notify_on_new_match) WHERE notify_on_new_match;
