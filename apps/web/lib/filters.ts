"use client";

/**
 * URL <-> SearchFilters via nuqs.
 *
 * We expose a single `useSearchFilters()` hook that returns the current
 * filter state plus a setter that updates the URL atomically.
 */
import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsFloat,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";
import type { SearchFilters } from "@creatordeck/types";
import {
  CONTENT_STYLES,
  PLATFORM_KINDS,
  PRICING_MODELS,
} from "@creatordeck/types";

const CONTENT_STYLE_VALUES = [...CONTENT_STYLES] as string[];
const PLATFORM_VALUES = [...PLATFORM_KINDS] as string[];
const PRICING_VALUES = [...PRICING_MODELS] as string[];

export const filterParsers = {
  niche: parseAsArrayOf(parseAsString).withDefault([]),
  niche_match: parseAsStringEnum(["any", "all"]).withDefault("any"),
  tags: parseAsArrayOf(parseAsString).withDefault([]),
  content_style: parseAsArrayOf(parseAsStringEnum(CONTENT_STYLE_VALUES)).withDefault([]),
  q: parseAsString.withDefault(""),
  platform: parseAsArrayOf(parseAsStringEnum(PLATFORM_VALUES)).withDefault([]),
  platform_match: parseAsStringEnum(["any", "all"]).withDefault("any"),
  follower_min: parseAsInteger,
  follower_max: parseAsInteger,
  engagement_rate_min: parseAsFloat,
  country: parseAsArrayOf(parseAsString).withDefault([]),
  language: parseAsArrayOf(parseAsString).withDefault([]),
  available_for_deals: parseAsBoolean.withDefault(true),
  open_to_gifted: parseAsBoolean,
  pricing_model: parseAsArrayOf(parseAsStringEnum(PRICING_VALUES)).withDefault([]),
  price_min_cents: parseAsInteger,
  price_max_cents: parseAsInteger,
  sort: parseAsStringEnum([
    "relevance",
    "engagement",
    "followers",
    "price_asc",
    "price_desc",
    "recently_active",
    "newest",
  ]).withDefault("relevance"),
  page: parseAsInteger.withDefault(1),
  per_page: parseAsInteger.withDefault(24),
} as const;

/**
 * Returns [state, setState] tuple. State has all keys above, with arrays
 * defaulted to []; numeric maybe-null fields stay nullable.
 */
export function useSearchFilters() {
  return useQueryStates(filterParsers, {
    history: "replace",
    shallow: false,
    throttleMs: 200,
  });
}

/**
 * Convert nuqs state to a `SearchFilters` ready for the API client.
 */
export function stateToFilters(state: ReturnType<typeof useSearchFilters>[0]): SearchFilters {
  const out: SearchFilters = {};
  if (state.niche.length) out.niche = state.niche;
  if (state.niche_match !== "any") out.niche_match = state.niche_match;
  if (state.tags.length) out.tags = state.tags;
  if (state.content_style.length) out.content_style = state.content_style as SearchFilters["content_style"];
  if (state.q) out.q = state.q;
  if (state.platform.length) out.platform = state.platform as SearchFilters["platform"];
  if (state.platform_match !== "any") out.platform_match = state.platform_match;
  if (state.follower_min !== null) out.follower_min = state.follower_min;
  if (state.follower_max !== null) out.follower_max = state.follower_max;
  if (state.engagement_rate_min !== null) out.engagement_rate_min = state.engagement_rate_min;
  if (state.country.length) out.country = state.country;
  if (state.language.length) out.language = state.language;
  if (!state.available_for_deals) out.available_for_deals = false;
  if (state.open_to_gifted !== null) out.open_to_gifted = state.open_to_gifted;
  if (state.pricing_model.length) out.pricing_model = state.pricing_model as SearchFilters["pricing_model"];
  if (state.price_min_cents !== null) out.price_min_cents = state.price_min_cents;
  if (state.price_max_cents !== null) out.price_max_cents = state.price_max_cents;
  if (state.sort !== "relevance") out.sort = state.sort;
  if (state.page !== 1) out.page = state.page;
  if (state.per_page !== 24) out.per_page = state.per_page;
  return out;
}

/**
 * Count of *active* filter dimensions, for the mobile filter button badge.
 */
export function countActive(state: ReturnType<typeof useSearchFilters>[0]): number {
  let n = 0;
  if (state.niche.length) n += 1;
  if (state.tags.length) n += 1;
  if (state.content_style.length) n += 1;
  if (state.q) n += 1;
  if (state.platform.length) n += 1;
  if (state.follower_min !== null || state.follower_max !== null) n += 1;
  if (state.engagement_rate_min !== null) n += 1;
  if (state.country.length) n += 1;
  if (state.language.length) n += 1;
  if (state.pricing_model.length) n += 1;
  if (state.price_min_cents !== null || state.price_max_cents !== null) n += 1;
  if (state.open_to_gifted) n += 1;
  return n;
}

export const EMPTY_FILTERS: Record<string, null | [] | string | number | boolean> = {
  niche: [],
  niche_match: "any",
  tags: [],
  content_style: [],
  q: "",
  platform: [],
  platform_match: "any",
  follower_min: null,
  follower_max: null,
  engagement_rate_min: null,
  country: [],
  language: [],
  available_for_deals: true,
  open_to_gifted: null,
  pricing_model: [],
  price_min_cents: null,
  price_max_cents: null,
  sort: "relevance",
  page: 1,
  per_page: 24,
};
