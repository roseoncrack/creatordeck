-- ============================================================
-- 0006_creator_platforms.sql
-- One row per (creator, platform). Tokens encrypted at rest.
-- ============================================================

CREATE TABLE IF NOT EXISTS creator_platforms (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id            UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  platform              platform_kind NOT NULL,

  -- Identity
  external_id           TEXT,
  handle                TEXT NOT NULL,
  url                   TEXT NOT NULL,
  display_name          TEXT,
  avatar_url            TEXT,

  -- Verification
  verified_at           TIMESTAMPTZ,
  verification_method   TEXT CHECK (verification_method IN ('oauth','admin','metatag','dm_code')),
  oauth_scopes          TEXT[] NOT NULL DEFAULT '{}',
  access_token_enc      BYTEA,
  refresh_token_enc     BYTEA,
  token_expires_at      TIMESTAMPTZ,

  -- Stats
  followers             BIGINT NOT NULL DEFAULT 0,
  following             BIGINT,
  posts_count           BIGINT,
  avg_views_30d         BIGINT NOT NULL DEFAULT 0,
  median_views_30d      BIGINT,
  avg_likes_30d         BIGINT NOT NULL DEFAULT 0,
  avg_comments_30d      BIGINT NOT NULL DEFAULT 0,
  avg_shares_30d        BIGINT,
  avg_saves_30d         BIGINT,
  engagement_rate       NUMERIC(5,4) NOT NULL DEFAULT 0,
  views_to_follower     NUMERIC(5,4),
  growth_rate_30d       NUMERIC(6,4),

  -- Audience snapshot
  audience_demo         JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Health flags
  suspected_bot_pct     NUMERIC(5,4),
  last_post_at          TIMESTAMPTZ,
  is_dormant            BOOLEAN NOT NULL DEFAULT FALSE,

  -- Lifecycle
  last_synced_at        TIMESTAMPTZ,
  next_sync_at          TIMESTAMPTZ,
  sync_error            TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (creator_id, platform),
  UNIQUE (platform, external_id)
);

CREATE INDEX IF NOT EXISTS idx_cp_creator
  ON creator_platforms(creator_id);
CREATE INDEX IF NOT EXISTS idx_cp_platform_followers
  ON creator_platforms(platform, followers DESC);
CREATE INDEX IF NOT EXISTS idx_cp_platform_er
  ON creator_platforms(platform, engagement_rate DESC);
CREATE INDEX IF NOT EXISTS idx_cp_next_sync
  ON creator_platforms(next_sync_at) WHERE next_sync_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_cp_handle_trgm
  ON creator_platforms USING GIN (handle gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_cp_verified
  ON creator_platforms(creator_id, platform) WHERE verified_at IS NOT NULL;
