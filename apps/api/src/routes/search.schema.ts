/**
 * Zod schemas for `/api/creators/search` query parsing.
 * Mirrors `search-api.md`.
 *
 * Express delivers repeated query params as arrays. We accept either form
 * and normalize to arrays via `coerceArray()`.
 */
import { z } from "zod";
import {
  CONTENT_STYLES,
  PLATFORM_KINDS,
  PRICING_MODELS,
} from "@creatordeck/types";

const arrayish = <T extends z.ZodTypeAny>(item: T) =>
  z.preprocess((v) => {
    if (v === undefined || v === null || v === "") return undefined;
    if (Array.isArray(v)) return v;
    if (typeof v === "string") return v.split(",").map((s) => s.trim()).filter(Boolean);
    return [v];
  }, z.array(item).optional());

const boolish = z
  .preprocess((v) => {
    if (v === undefined || v === null || v === "") return undefined;
    if (typeof v === "boolean") return v;
    if (typeof v === "string") {
      const s = v.toLowerCase();
      if (["true", "1", "yes", "on"].includes(s)) return true;
      if (["false", "0", "no", "off"].includes(s)) return false;
    }
    return v;
  }, z.boolean().optional());

export const searchQuerySchema = z
  .object({
    // Niche & content
    niche: arrayish(z.string().uuid()),
    niche_match: z.enum(["any", "all"]).default("any"),
    tags: arrayish(z.string().min(1).max(40)),
    content_style: arrayish(z.enum(CONTENT_STYLES)),
    q: z.string().max(120).optional(),

    // Platform & stats
    platform: arrayish(z.enum(PLATFORM_KINDS)),
    platform_match: z.enum(["any", "all"]).default("any"),

    follower_min: z.coerce.number().int().min(0).optional(),
    follower_max: z.coerce.number().int().min(0).optional(),
    platform_follower_min: z.coerce.number().int().min(0).optional(),
    platform_follower_max: z.coerce.number().int().min(0).optional(),
    engagement_rate_min: z.coerce.number().min(0).max(1).optional(),
    avg_views_min: z.coerce.number().int().min(0).optional(),
    growth_rate_min: z.coerce.number().min(-1).max(10).optional(),

    verified_only: boolish.default(false),
    exclude_dormant: boolish.default(true),

    // Location & language
    country: arrayish(z.string().length(2)),
    region: z.string().max(80).optional(),
    city: z.string().max(80).optional(),
    language: arrayish(z.string().length(2)),
    audience_country: arrayish(z.string().length(2)),
    audience_country_min_pct: z.coerce.number().min(0).max(1).default(0.3),

    // Pricing & availability
    available_for_deals: boolish.default(true),
    open_to_gifted: boolish,
    pricing_model: arrayish(z.enum(PRICING_MODELS)),
    price_min_cents: z.coerce.number().int().min(0).optional(),
    price_max_cents: z.coerce.number().int().min(0).optional(),
    min_engagement_pledge: z.coerce.number().min(0).max(1).optional(),

    // Sort & pagination
    sort: z
      .enum([
        "relevance",
        "engagement",
        "followers",
        "price_asc",
        "price_desc",
        "recently_active",
        "newest",
      ])
      .default("relevance"),
    page: z.coerce.number().int().min(1).max(50).default(1),
    per_page: z.coerce.number().int().min(1).max(60).default(24),
    cursor: z.string().optional(),

    // Misc
    exclude_pitched: boolish.default(false),
    exclude_in_deal: boolish.default(false),
    save_search_id: z.string().uuid().optional(),
    include: arrayish(
      z.enum(["platforms", "niches", "tags", "audience_demo", "rate_card"]),
    ).default(["platforms", "niches"]),
  })
  .refine(
    (v) =>
      v.follower_min === undefined ||
      v.follower_max === undefined ||
      v.follower_min <= v.follower_max,
    { message: "follower_min must be ≤ follower_max", path: ["follower_min"] },
  )
  .refine(
    (v) =>
      v.price_min_cents === undefined ||
      v.price_max_cents === undefined ||
      v.price_min_cents <= v.price_max_cents,
    { message: "price_min_cents must be ≤ price_max_cents", path: ["price_min_cents"] },
  );

export type SearchQuery = z.infer<typeof searchQuerySchema>;
