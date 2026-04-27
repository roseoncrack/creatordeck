import type {
  ContentStyle,
  CreatorStatus,
  PlatformKind,
  PricingModel,
  VerificationMethod,
} from "./enums";
import type { CreatorNicheHydrated } from "./niche";

/**
 * Audience demographics blob.
 * Stored as JSONB; all keys optional and forward-compatible.
 */
export interface AudienceDemo {
  age?: Record<string, number>;
  gender?: Record<"male" | "female" | "other", number>;
  geo?: Record<string, number>;
}

/**
 * Rate card. Keys are conventional like `youtube_integration_60s`,
 * `ig_reel`, `tiktok_post`. Values are USD cents.
 */
export type RateCard = Record<string, number>;

export interface Creator {
  id: string;
  user_id: string;
  status: CreatorStatus;

  display_name: string;
  handle: string;
  bio: string | null;
  avatar_url: string | null;
  banner_url: string | null;

  country_code: string | null;
  region: string | null;
  city: string | null;
  timezone: string | null;
  languages: string[];

  primary_content_style: ContentStyle | null;
  content_style_tags: ContentStyle[];
  audience_demo: AudienceDemo;

  rate_card: RateCard;
  base_price_cents: number | null;
  pricing_models: PricingModel[];

  available_for_deals: boolean;
  open_to_gifted: boolean;
  exclusivity_friendly: boolean;
  min_engagement_pledge: number | null;

  total_followers: number;
  avg_engagement_rate: number;
  primary_platform: PlatformKind | null;
  platforms_count: number;
  last_synced_at: string | null;

  identity_verified_at: string | null;
  email_verified_at: string | null;

  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

/**
 * Linked platform with verified stats.
 */
export interface CreatorPlatform {
  id: string;
  creator_id: string;
  platform: PlatformKind;

  external_id: string | null;
  handle: string;
  url: string;
  display_name: string | null;
  avatar_url: string | null;

  verified_at: string | null;
  verification_method: VerificationMethod | null;
  oauth_scopes: string[];

  followers: number;
  following: number | null;
  posts_count: number | null;
  avg_views_30d: number;
  median_views_30d: number | null;
  avg_likes_30d: number;
  avg_comments_30d: number;
  avg_shares_30d: number | null;
  avg_saves_30d: number | null;
  engagement_rate: number;
  views_to_follower: number | null;
  growth_rate_30d: number | null;

  audience_demo: AudienceDemo;

  suspected_bot_pct: number | null;
  last_post_at: string | null;
  is_dormant: boolean;

  last_synced_at: string | null;
  next_sync_at: string | null;
  sync_error: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Card-shaped platform info exposed via API (never tokens).
 */
export interface CreatorPlatformPublic {
  platform: PlatformKind;
  handle: string;
  url: string;
  followers: number;
  avg_views_30d: number;
  engagement_rate: number;
  verified: boolean;
  is_dormant: boolean;
}

export interface CreatorTag {
  creator_id: string;
  tag: string;
  source: "self" | "brand" | "admin" | "ml";
  created_at: string;
}

/**
 * Hydrated creator returned by search and profile endpoints.
 */
export interface CreatorPublic
  extends Omit<
    Creator,
    "user_id" | "deleted_at"
  > {
  identity_verified: boolean;
  score?: number;
  platforms?: CreatorPlatformPublic[];
  niches?: CreatorNicheHydrated[];
  tags?: string[];
}
