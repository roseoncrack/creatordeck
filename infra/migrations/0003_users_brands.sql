-- ============================================================
-- 0003_users_brands.sql
-- Mirror of Clerk users + brand orgs.
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id   TEXT NOT NULL UNIQUE,
  email           CITEXT NOT NULL UNIQUE,
  display_name    TEXT,
  avatar_url      TEXT,
  role            TEXT NOT NULL CHECK (role IN ('creator','brand','admin')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_clerk ON users(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_users_role  ON users(role);

CREATE TABLE IF NOT EXISTS brands (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id        UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  name                 TEXT NOT NULL,
  slug                 TEXT NOT NULL UNIQUE,
  website              TEXT,
  industry             TEXT,
  logo_url             TEXT,
  stripe_customer_id   TEXT,
  monthly_budget_cents BIGINT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_brands_owner ON brands(owner_user_id);
