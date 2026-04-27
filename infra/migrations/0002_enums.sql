-- ============================================================
-- 0002_enums.sql
-- Postgres ENUM types.
-- Mirrored in packages/types/src/enums.ts.
-- ============================================================

DO $$ BEGIN
  CREATE TYPE platform_kind AS ENUM (
    'youtube', 'tiktok', 'instagram', 'twitter', 'twitch',
    'youtube_shorts', 'reddit', 'pinterest', 'linkedin'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE creator_status AS ENUM (
    'draft', 'pending', 'active', 'paused', 'banned'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE content_style AS ENUM (
    'long_form_video', 'short_form_video', 'live_stream',
    'photo', 'carousel', 'written', 'podcast', 'mixed'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE deal_status AS ENUM (
    'pitched', 'declined', 'negotiating', 'accepted',
    'briefed', 'in_progress', 'submitted', 'revisions',
    'approved', 'paid', 'completed', 'cancelled', 'disputed'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE pricing_model AS ENUM (
    'flat_fee', 'cpm', 'affiliate', 'hybrid', 'gifted'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
