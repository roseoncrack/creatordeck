-- ============================================================
-- 0005_creators.sql
-- The core creator profile table.
-- ============================================================

CREATE TABLE IF NOT EXISTS creators (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE RESTRICT,
  status                creator_status NOT NULL DEFAULT 'draft',

  -- Profile
  display_name          TEXT NOT NULL,
  handle                CITEXT NOT NULL UNIQUE,
  bio                   TEXT,
  avatar_url            TEXT,
  banner_url            TEXT,

  -- Location & language
  country_code          CHAR(2),
  region                TEXT,
  city                  TEXT,
  timezone              TEXT,
  languages             TEXT[] NOT NULL DEFAULT '{}',

  -- Content
  primary_content_style content_style,
  content_style_tags    content_style[] NOT NULL DEFAULT '{}',
  audience_demo         JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Rate card
  rate_card             JSONB NOT NULL DEFAULT '{}'::jsonb,
  base_price_cents      BIGINT,
  pricing_models        pricing_model[] NOT NULL DEFAULT '{}',

  -- Marketplace flags
  available_for_deals   BOOLEAN NOT NULL DEFAULT TRUE,
  open_to_gifted        BOOLEAN NOT NULL DEFAULT FALSE,
  exclusivity_friendly  BOOLEAN NOT NULL DEFAULT FALSE,
  min_engagement_pledge NUMERIC(5,4),

  -- Cached aggregates
  total_followers       BIGINT NOT NULL DEFAULT 0,
  avg_engagement_rate   NUMERIC(5,4) NOT NULL DEFAULT 0,
  primary_platform      platform_kind,
  platforms_count       INT NOT NULL DEFAULT 0,
  last_synced_at        TIMESTAMPTZ,

  -- Search vector (populated via trigger — unaccent is not immutable so cannot use GENERATED ALWAYS)
  search_tsv            tsvector,

  -- Verification
  identity_verified_at  TIMESTAMPTZ,
  email_verified_at     TIMESTAMPTZ,

  -- Lifecycle
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at            TIMESTAMPTZ
);

-- Hot filters (partial indexes only count active, non-deleted)
CREATE INDEX IF NOT EXISTS idx_creators_status_active
  ON creators(status) WHERE status = 'active' AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_creators_followers
  ON creators(total_followers) WHERE status = 'active' AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_creators_er
  ON creators(avg_engagement_rate) WHERE status = 'active' AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_creators_country
  ON creators(country_code) WHERE status = 'active' AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_creators_languages_gin
  ON creators USING GIN (languages);
CREATE INDEX IF NOT EXISTS idx_creators_pricing_gin
  ON creators USING GIN (pricing_models);
CREATE INDEX IF NOT EXISTS idx_creators_styles_gin
  ON creators USING GIN (content_style_tags);
CREATE INDEX IF NOT EXISTS idx_creators_search_tsv
  ON creators USING GIN (search_tsv);
CREATE INDEX IF NOT EXISTS idx_creators_handle_trgm
  ON creators USING GIN ((handle::text) gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_creators_base_price
  ON creators(base_price_cents) WHERE available_for_deals;
CREATE INDEX IF NOT EXISTS idx_creators_user
  ON creators(user_id);
