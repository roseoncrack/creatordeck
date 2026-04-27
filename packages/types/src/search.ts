import type { ContentStyle, PlatformKind, PricingModel } from "./enums";
import type { CreatorPublic } from "./creator";

export type SortKey =
  | "relevance"
  | "engagement"
  | "followers"
  | "price_asc"
  | "price_desc"
  | "recently_active"
  | "newest";

export type IncludeKey =
  | "platforms"
  | "niches"
  | "tags"
  | "audience_demo"
  | "rate_card";

export interface SearchFilters {
  // Niche & content
  niche?: string[];
  niche_match?: "any" | "all";
  tags?: string[];
  content_style?: ContentStyle[];
  q?: string;

  // Platform & stats
  platform?: PlatformKind[];
  platform_match?: "any" | "all";
  follower_min?: number;
  follower_max?: number;
  platform_follower_min?: number;
  platform_follower_max?: number;
  engagement_rate_min?: number;
  avg_views_min?: number;
  growth_rate_min?: number;
  verified_only?: boolean;
  exclude_dormant?: boolean;

  // Location & language
  country?: string[];
  region?: string;
  city?: string;
  language?: string[];
  audience_country?: string[];
  audience_country_min_pct?: number;

  // Pricing & availability
  available_for_deals?: boolean;
  open_to_gifted?: boolean;
  pricing_model?: PricingModel[];
  price_min_cents?: number;
  price_max_cents?: number;
  min_engagement_pledge?: number;

  // Sort & pagination
  sort?: SortKey;
  page?: number;
  per_page?: number;
  cursor?: string;

  // Misc
  exclude_pitched?: boolean;
  exclude_in_deal?: boolean;
  save_search_id?: string;
  include?: IncludeKey[];
}

export interface SearchPagination {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  next_cursor: string | null;
  has_next: boolean;
}

export interface FacetBucket<T = string> {
  value: T;
  count: number;
  label?: string;
}

export interface NicheFacet {
  id: string;
  slug: string;
  label: string;
  count: number;
}

export interface PlatformFacet {
  platform: PlatformKind;
  count: number;
}

export interface CountryFacet {
  code: string;
  count: number;
}

export interface ContentStyleFacet {
  style: ContentStyle;
  count: number;
}

export interface RangeBucket {
  min: number;
  max: number | null;
  count: number;
}

export interface PriceBucket {
  min_cents: number;
  max_cents: number | null;
  count: number;
}

export interface SearchFacets {
  niches: NicheFacet[];
  platforms: PlatformFacet[];
  countries: CountryFacet[];
  content_styles: ContentStyleFacet[];
  follower_buckets: RangeBucket[];
  price_buckets: PriceBucket[];
}

export interface SearchMeta {
  query_id: string;
  elapsed_ms: number;
  cached: boolean;
  applied_filters: SearchFilters;
}

export interface SearchResult extends CreatorPublic {
  score: number;
}

export interface SearchResponse {
  data: SearchResult[];
  pagination: SearchPagination;
  facets: SearchFacets;
  meta: SearchMeta;
}

export interface ApiError {
  error: string;
  message: string;
  fields?: Record<string, string>;
  retry_after_sec?: number;
  request_id?: string;
}
