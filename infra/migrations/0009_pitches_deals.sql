-- ============================================================
-- 0009_pitches_deals.sql
-- Pitch outreach + deal contract tables.
-- ============================================================

CREATE TABLE IF NOT EXISTS pitches (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id              UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  creator_id            UUID NOT NULL REFERENCES creators(id) ON DELETE RESTRICT,
  search_id             UUID REFERENCES brand_searches(id) ON DELETE SET NULL,

  subject               TEXT NOT NULL,
  message               TEXT NOT NULL,
  proposed_budget_cents BIGINT,
  proposed_deliverables JSONB NOT NULL DEFAULT '[]'::jsonb,

  status                TEXT NOT NULL DEFAULT 'sent'
                        CHECK (status IN ('draft','sent','viewed','replied','accepted','declined','expired')),
  viewed_at             TIMESTAMPTZ,
  replied_at            TIMESTAMPTZ,
  decided_at            TIMESTAMPTZ,
  expires_at            TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '14 days',

  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (brand_id, creator_id, created_at)
);

CREATE INDEX IF NOT EXISTS idx_pitches_creator ON pitches(creator_id, status);
CREATE INDEX IF NOT EXISTS idx_pitches_brand   ON pitches(brand_id, status);


CREATE TABLE IF NOT EXISTS deals (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pitch_id                 UUID UNIQUE REFERENCES pitches(id) ON DELETE RESTRICT,
  brand_id                 UUID NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
  creator_id               UUID NOT NULL REFERENCES creators(id) ON DELETE RESTRICT,

  status                   deal_status NOT NULL DEFAULT 'pitched',
  pricing_model            pricing_model NOT NULL,

  agreed_amount_cents      BIGINT NOT NULL,
  platform_fee_cents       BIGINT NOT NULL DEFAULT 0,
  currency                 CHAR(3) NOT NULL DEFAULT 'USD',
  stripe_payment_intent_id TEXT,
  stripe_transfer_id       TEXT,
  escrow_funded_at         TIMESTAMPTZ,
  paid_out_at              TIMESTAMPTZ,

  brief                    TEXT,
  deliverables             JSONB NOT NULL DEFAULT '[]'::jsonb,
  usage_rights             JSONB NOT NULL DEFAULT '{}'::jsonb,
  exclusivity              JSONB NOT NULL DEFAULT '{}'::jsonb,
  start_date               DATE,
  due_date                 DATE,
  completed_at             TIMESTAMPTZ,

  cancelled_at             TIMESTAMPTZ,
  cancelled_by             UUID REFERENCES users(id),
  cancellation_reason      TEXT,
  dispute_opened_at        TIMESTAMPTZ,

  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at               TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_deals_brand_status   ON deals(brand_id, status);
CREATE INDEX IF NOT EXISTS idx_deals_creator_status ON deals(creator_id, status);
CREATE INDEX IF NOT EXISTS idx_deals_status_due     ON deals(status, due_date);
