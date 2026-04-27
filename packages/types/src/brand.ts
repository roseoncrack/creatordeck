import type { DealStatus, PitchStatus, PricingModel } from "./enums";

export interface Brand {
  id: string;
  owner_user_id: string;
  name: string;
  slug: string;
  website: string | null;
  industry: string | null;
  logo_url: string | null;
  stripe_customer_id: string | null;
  monthly_budget_cents: number | null;
  created_at: string;
  updated_at: string;
}

export interface ProposedDeliverable {
  platform: string;
  type: string;
  quantity: number;
}

export interface Pitch {
  id: string;
  brand_id: string;
  creator_id: string;
  search_id: string | null;

  subject: string;
  message: string;
  proposed_budget_cents: number | null;
  proposed_deliverables: ProposedDeliverable[];

  status: PitchStatus;
  viewed_at: string | null;
  replied_at: string | null;
  decided_at: string | null;
  expires_at: string;

  created_at: string;
  updated_at: string;
}

export interface DealDeliverable {
  id: string;
  platform: string;
  type: string;
  quantity: number;
  due_at: string | null;
  status: string;
  url: string | null;
}

export interface UsageRights {
  organic?: boolean;
  paid_ads?: boolean;
  duration_days?: number;
  territories?: string[];
}

export interface Exclusivity {
  category_lockout?: string[];
  days?: number;
}

export interface Deal {
  id: string;
  pitch_id: string | null;
  brand_id: string;
  creator_id: string;

  status: DealStatus;
  pricing_model: PricingModel;

  agreed_amount_cents: number;
  platform_fee_cents: number;
  currency: string;
  stripe_payment_intent_id: string | null;
  stripe_transfer_id: string | null;
  escrow_funded_at: string | null;
  paid_out_at: string | null;

  brief: string | null;
  deliverables: DealDeliverable[];
  usage_rights: UsageRights;
  exclusivity: Exclusivity;
  start_date: string | null;
  due_date: string | null;
  completed_at: string | null;

  cancelled_at: string | null;
  cancelled_by: string | null;
  cancellation_reason: string | null;
  dispute_opened_at: string | null;

  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface BrandSearch {
  id: string;
  brand_id: string;
  created_by: string;
  name: string;
  description: string | null;
  filters: Record<string, unknown>;
  sort: string;
  notify_on_new_match: boolean;
  last_run_at: string | null;
  last_match_count: number | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  clerk_user_id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  role: "creator" | "brand" | "admin";
  created_at: string;
  updated_at: string;
}
