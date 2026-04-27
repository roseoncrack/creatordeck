-- ============================================================
-- 0001_init_extensions.sql
-- Postgres extensions used across the schema.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;     -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pg_trgm;      -- fuzzy handle/name search
CREATE EXTENSION IF NOT EXISTS btree_gin;    -- composite GIN indexes
CREATE EXTENSION IF NOT EXISTS unaccent;     -- "café" matches "cafe"
CREATE EXTENSION IF NOT EXISTS ltree;        -- niche path subtree queries
CREATE EXTENSION IF NOT EXISTS citext;       -- case-insensitive text (handles, emails)
