/**
 * Enum mirrors of Postgres ENUM types.
 * Keep in sync with `infra/migrations/0002_enums.sql`.
 */

export const PLATFORM_KINDS = [
  "youtube",
  "tiktok",
  "instagram",
  "twitter",
  "twitch",
  "youtube_shorts",
  "reddit",
  "pinterest",
  "linkedin",
] as const;
export type PlatformKind = (typeof PLATFORM_KINDS)[number];

export const CREATOR_STATUSES = [
  "draft",
  "pending",
  "active",
  "paused",
  "banned",
] as const;
export type CreatorStatus = (typeof CREATOR_STATUSES)[number];

export const CONTENT_STYLES = [
  "long_form_video",
  "short_form_video",
  "live_stream",
  "photo",
  "carousel",
  "written",
  "podcast",
  "mixed",
] as const;
export type ContentStyle = (typeof CONTENT_STYLES)[number];

export const DEAL_STATUSES = [
  "pitched",
  "declined",
  "negotiating",
  "accepted",
  "briefed",
  "in_progress",
  "submitted",
  "revisions",
  "approved",
  "paid",
  "completed",
  "cancelled",
  "disputed",
] as const;
export type DealStatus = (typeof DEAL_STATUSES)[number];

export const PRICING_MODELS = [
  "flat_fee",
  "cpm",
  "affiliate",
  "hybrid",
  "gifted",
] as const;
export type PricingModel = (typeof PRICING_MODELS)[number];

export const PITCH_STATUSES = [
  "draft",
  "sent",
  "viewed",
  "replied",
  "accepted",
  "declined",
  "expired",
] as const;
export type PitchStatus = (typeof PITCH_STATUSES)[number];

export const USER_ROLES = ["creator", "brand", "admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const NICHE_SOURCES = ["self", "admin", "ml"] as const;
export type NicheSource = (typeof NICHE_SOURCES)[number];

export const VERIFICATION_METHODS = [
  "oauth",
  "admin",
  "metatag",
  "dm_code",
] as const;
export type VerificationMethod = (typeof VERIFICATION_METHODS)[number];
