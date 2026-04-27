-- ============================================================
-- 0007_creator_niches_tags.sql
-- Many-to-many between creators and niches, plus freeform tags.
-- ============================================================

CREATE TABLE IF NOT EXISTS creator_niches (
  creator_id    UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  niche_id      UUID NOT NULL REFERENCES niche_taxonomy(id) ON DELETE RESTRICT,
  weight        NUMERIC(3,2) NOT NULL DEFAULT 1.00 CHECK (weight BETWEEN 0 AND 1),
  is_primary    BOOLEAN NOT NULL DEFAULT FALSE,
  source        TEXT NOT NULL DEFAULT 'self' CHECK (source IN ('self','admin','ml')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  PRIMARY KEY (creator_id, niche_id)
);

CREATE INDEX IF NOT EXISTS idx_cn_niche   ON creator_niches(niche_id);
CREATE INDEX IF NOT EXISTS idx_cn_primary ON creator_niches(creator_id) WHERE is_primary;

-- At most one primary niche per creator
CREATE UNIQUE INDEX IF NOT EXISTS uq_cn_one_primary
  ON creator_niches(creator_id) WHERE is_primary;


CREATE TABLE IF NOT EXISTS creator_tags (
  creator_id    UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  tag           CITEXT NOT NULL,
  source        TEXT NOT NULL DEFAULT 'self' CHECK (source IN ('self','brand','admin','ml')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  PRIMARY KEY (creator_id, tag)
);

CREATE INDEX IF NOT EXISTS idx_ct_tag ON creator_tags(tag);
CREATE INDEX IF NOT EXISTS idx_ct_creator_tag_gin
  ON creator_tags USING GIN (creator_id, tag);
