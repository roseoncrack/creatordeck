/**
 * Creator search — dynamic query builder.
 *
 * Hot path. Hand-tuned for index usage:
 *   - Only emits WHERE clauses for filters that are actually set.
 *   - Niche subtree expansion via ltree (`<@`).
 *   - Verified-only platform existence checks via EXISTS subqueries.
 *   - Hydration in batched followup queries (one per join), not N+1.
 *
 * Returns the shape `SearchResponse` from @creatordeck/types.
 */
import type {
  AudienceDemo,
  ContentStyle,
  CreatorNicheHydrated,
  CreatorPlatformPublic,
  PlatformKind,
  RateCard,
  SearchFacets,
  SearchPagination,
  SearchResponse,
  SearchResult,
} from "@creatordeck/types";
import { query } from "../db/client";
import type { SearchQuery } from "../routes/search.schema";

interface BuiltClauses {
  /** Composable WHERE fragments (joined with AND). */
  where: string[];
  /** Parameter values matching $N indexes in `where`. */
  params: unknown[];
  /** CTE block (if any) to prepend. */
  ctes: string[];
}

/**
 * Push a clause + params, returning the placeholder string with auto-index.
 */
function pushParam(b: BuiltClauses, value: unknown): string {
  b.params.push(value);
  return `$${b.params.length}`;
}

/**
 * Build the WHERE clauses + params for a given filter set. Reused for
 * the main result query and for facet counts.
 */
function buildClauses(
  q: SearchQuery,
  options: { brandId: string; includeNicheClause: boolean } = {
    brandId: "",
    includeNicheClause: true,
  },
): BuiltClauses {
  const b: BuiltClauses = { where: [], params: [], ctes: [] };

  // Always-on hygiene
  b.where.push(`c.status = 'active'`);
  b.where.push(`c.deleted_at IS NULL`);

  // Boolean toggles
  if (q.available_for_deals !== undefined) {
    b.where.push(`c.available_for_deals = ${pushParam(b, q.available_for_deals)}::boolean`);
  }
  if (q.open_to_gifted !== undefined) {
    b.where.push(`c.open_to_gifted = ${pushParam(b, q.open_to_gifted)}::boolean`);
  }

  // Followers
  if (q.follower_min !== undefined) {
    b.where.push(`c.total_followers >= ${pushParam(b, q.follower_min)}::bigint`);
  }
  if (q.follower_max !== undefined) {
    b.where.push(`c.total_followers <= ${pushParam(b, q.follower_max)}::bigint`);
  }

  // Engagement
  if (q.engagement_rate_min !== undefined) {
    b.where.push(`c.avg_engagement_rate >= ${pushParam(b, q.engagement_rate_min)}::numeric`);
  }
  if (q.min_engagement_pledge !== undefined) {
    b.where.push(`c.min_engagement_pledge >= ${pushParam(b, q.min_engagement_pledge)}::numeric`);
  }

  // Location
  if (q.country?.length) {
    b.where.push(`c.country_code = ANY(${pushParam(b, q.country)}::char(2)[])`);
  }
  if (q.region) {
    b.where.push(`c.region ILIKE ${pushParam(b, `%${q.region}%`)}`);
  }
  if (q.city) {
    b.where.push(`c.city ILIKE ${pushParam(b, `%${q.city}%`)}`);
  }

  // Languages (ANY-match via array overlap)
  if (q.language?.length) {
    b.where.push(`c.languages && ${pushParam(b, q.language)}::text[]`);
  }

  // Content styles (ANY-match)
  if (q.content_style?.length) {
    b.where.push(`c.content_style_tags && ${pushParam(b, q.content_style)}::content_style[]`);
  }

  // Pricing
  if (q.price_min_cents !== undefined) {
    b.where.push(`c.base_price_cents >= ${pushParam(b, q.price_min_cents)}::bigint`);
  }
  if (q.price_max_cents !== undefined) {
    b.where.push(`c.base_price_cents <= ${pushParam(b, q.price_max_cents)}::bigint`);
  }
  if (q.pricing_model?.length) {
    b.where.push(`c.pricing_models && ${pushParam(b, q.pricing_model)}::pricing_model[]`);
  }

  // Free-text
  if (q.q && q.q.trim().length > 0) {
    b.where.push(
      `(c.search_tsv @@ plainto_tsquery('english', ${pushParam(b, q.q)})
        OR c.handle::text ILIKE ${pushParam(b, `%${q.q}%`)})`,
    );
  }

  // Niche filter — ltree subtree expansion via CTE.
  if (options.includeNicheClause && q.niche?.length) {
    const idsPlaceholder = pushParam(b, q.niche);
    b.ctes.push(`
      wanted_niches AS (
        SELECT n2.id
        FROM niche_taxonomy n1
        JOIN niche_taxonomy n2 ON n2.path <@ n1.path
        WHERE n1.id = ANY(${idsPlaceholder}::uuid[])
      )
    `);

    if (q.niche_match === "all") {
      // Creator must match *every* selected root niche subtree.
      const nichesPh = pushParam(b, q.niche);
      b.where.push(`NOT EXISTS (
        SELECT 1
        FROM unnest(${nichesPh}::uuid[]) AS root_id
        WHERE NOT EXISTS (
          SELECT 1
          FROM creator_niches cn
          JOIN niche_taxonomy n2 ON n2.id = cn.niche_id
          JOIN niche_taxonomy nroot ON nroot.id = root_id
          WHERE cn.creator_id = c.id
            AND n2.path <@ nroot.path
        )
      )`);
    } else {
      b.where.push(`EXISTS (
        SELECT 1 FROM creator_niches cn
        WHERE cn.creator_id = c.id
          AND cn.niche_id IN (SELECT id FROM wanted_niches)
      )`);
    }
  }

  // Tags (AND semantics)
  if (q.tags?.length) {
    const tagsPh = pushParam(b, q.tags);
    b.where.push(`(
      SELECT COUNT(*) FROM creator_tags ct
      WHERE ct.creator_id = c.id
        AND ct.tag = ANY(${tagsPh}::citext[])
    ) = cardinality(${tagsPh}::citext[])`);
  }

  // Platform filter
  if (q.platform?.length) {
    const platPh = pushParam(b, q.platform);
    if (q.platform_match === "all") {
      // Must have *every* selected platform verified
      b.where.push(`(
        SELECT COUNT(DISTINCT cp.platform) FROM creator_platforms cp
        WHERE cp.creator_id = c.id
          AND cp.platform = ANY(${platPh}::platform_kind[])
          AND ${q.verified_only ? "cp.verified_at IS NOT NULL" : "TRUE"}
      ) = cardinality(${platPh}::platform_kind[])`);
    } else {
      b.where.push(`EXISTS (
        SELECT 1 FROM creator_platforms cp
        WHERE cp.creator_id = c.id
          AND cp.platform = ANY(${platPh}::platform_kind[])
          AND ${q.verified_only ? "cp.verified_at IS NOT NULL" : "TRUE"}
      )`);
    }

    // Per-platform follower bounds only meaningful with single platform
    if (q.platform.length === 1) {
      const onlyPlat = q.platform[0];
      if (q.platform_follower_min !== undefined) {
        b.where.push(`EXISTS (
          SELECT 1 FROM creator_platforms cp2
          WHERE cp2.creator_id = c.id
            AND cp2.platform = ${pushParam(b, onlyPlat)}::platform_kind
            AND cp2.followers >= ${pushParam(b, q.platform_follower_min)}::bigint
        )`);
      }
      if (q.platform_follower_max !== undefined) {
        b.where.push(`EXISTS (
          SELECT 1 FROM creator_platforms cp3
          WHERE cp3.creator_id = c.id
            AND cp3.platform = ${pushParam(b, onlyPlat)}::platform_kind
            AND cp3.followers <= ${pushParam(b, q.platform_follower_max)}::bigint
        )`);
      }
      if (q.avg_views_min !== undefined) {
        b.where.push(`EXISTS (
          SELECT 1 FROM creator_platforms cp4
          WHERE cp4.creator_id = c.id
            AND cp4.platform = ${pushParam(b, onlyPlat)}::platform_kind
            AND cp4.avg_views_30d >= ${pushParam(b, q.avg_views_min)}::bigint
        )`);
      }
    }
  } else if (q.verified_only) {
    b.where.push(`EXISTS (
      SELECT 1 FROM creator_platforms cp
      WHERE cp.creator_id = c.id
        AND cp.verified_at IS NOT NULL
    )`);
  }

  // Exclude dormant: every platform marked dormant excludes the creator.
  if (q.exclude_dormant) {
    b.where.push(`NOT EXISTS (
      SELECT 1 FROM creator_platforms cp
      WHERE cp.creator_id = c.id
    ) OR EXISTS (
      SELECT 1 FROM creator_platforms cp
      WHERE cp.creator_id = c.id
        AND cp.is_dormant = FALSE
    )`);
  }

  // Growth filter (single-platform meaningful only; soft on aggregate)
  if (q.growth_rate_min !== undefined) {
    b.where.push(`EXISTS (
      SELECT 1 FROM creator_platforms cp5
      WHERE cp5.creator_id = c.id
        AND cp5.growth_rate_30d >= ${pushParam(b, q.growth_rate_min)}::numeric
    )`);
  }

  // Audience country
  if (q.audience_country?.length) {
    const countriesPh = pushParam(b, q.audience_country);
    const minPctPh = pushParam(b, q.audience_country_min_pct);
    b.where.push(`EXISTS (
      SELECT 1
      FROM jsonb_each_text(coalesce(c.audience_demo->'geo','{}'::jsonb)) AS g(country, pct)
      WHERE g.country = ANY(${countriesPh}::text[])
        AND (g.pct)::numeric >= ${minPctPh}::numeric
    )`);
  }

  // Brand-specific exclusions
  if (q.exclude_pitched && options.brandId) {
    const brandPh = pushParam(b, options.brandId);
    b.where.push(`NOT EXISTS (
      SELECT 1 FROM pitches p
      WHERE p.brand_id = ${brandPh}::uuid
        AND p.creator_id = c.id
    )`);
  }
  if (q.exclude_in_deal && options.brandId) {
    const brandPh = pushParam(b, options.brandId);
    b.where.push(`NOT EXISTS (
      SELECT 1 FROM deals d
      WHERE d.brand_id = ${brandPh}::uuid
        AND d.creator_id = c.id
        AND d.status NOT IN ('cancelled','declined','disputed','completed')
    )`);
  }

  return b;
}

/**
 * Score expression for relevance ordering. Reused for `sort=relevance` and
 * for the `score` field in results.
 */
function scoreExpr(b: BuiltClauses, q: SearchQuery): string {
  const tsPh = q.q ? pushParam(b, q.q) : null;
  const tsRank = tsPh
    ? `ts_rank(c.search_tsv, plainto_tsquery('english', ${tsPh})) * 2.0`
    : `0`;

  const hasNiche = !!q.niche?.length;
  const nicheBonus = hasNiche
    ? `COALESCE((SELECT MAX(cn.weight)
                  FROM creator_niches cn
                  WHERE cn.creator_id = c.id
                    AND cn.niche_id IN (SELECT id FROM wanted_niches)), 0) * 3.0`
    : `0`;

  return `(
    ${tsRank}
    + ${nicheBonus}
    + LEAST(c.avg_engagement_rate * 50, 1.5)
    + CASE WHEN c.identity_verified_at IS NOT NULL THEN 0.3 ELSE 0 END
  )::float`;
}

function orderBy(sort: SearchQuery["sort"]): string {
  switch (sort) {
    case "engagement":
      return `ORDER BY c.avg_engagement_rate DESC NULLS LAST, c.total_followers DESC, c.id`;
    case "followers":
      return `ORDER BY c.total_followers DESC NULLS LAST, c.id`;
    case "price_asc":
      return `ORDER BY c.base_price_cents ASC NULLS LAST, c.id`;
    case "price_desc":
      return `ORDER BY c.base_price_cents DESC NULLS LAST, c.id`;
    case "recently_active":
      return `ORDER BY (
        SELECT MAX(cp.last_post_at) FROM creator_platforms cp WHERE cp.creator_id = c.id
      ) DESC NULLS LAST, c.id`;
    case "newest":
      return `ORDER BY c.created_at DESC, c.id`;
    case "relevance":
    default:
      return `ORDER BY score DESC NULLS LAST, c.total_followers DESC, c.id`;
  }
}

interface DbCreatorRow {
  id: string;
  status: string;
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
  base_price_cents: string | null; // bigint comes back as string
  pricing_models: SearchResult["pricing_models"];
  available_for_deals: boolean;
  open_to_gifted: boolean;
  exclusivity_friendly: boolean;
  min_engagement_pledge: string | null;
  total_followers: string;
  avg_engagement_rate: string;
  primary_platform: PlatformKind | null;
  platforms_count: number;
  last_synced_at: string | null;
  identity_verified_at: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  score: number | null;
}

function rowToResult(row: DbCreatorRow, includeRateCard: boolean): SearchResult {
  return {
    id: row.id,
    status: row.status as SearchResult["status"],
    display_name: row.display_name,
    handle: row.handle,
    bio: row.bio,
    avatar_url: row.avatar_url,
    banner_url: row.banner_url,
    country_code: row.country_code,
    region: row.region,
    city: row.city,
    timezone: row.timezone,
    languages: row.languages ?? [],
    primary_content_style: row.primary_content_style,
    content_style_tags: row.content_style_tags ?? [],
    audience_demo: row.audience_demo ?? {},
    rate_card: includeRateCard ? row.rate_card ?? {} : {},
    base_price_cents: row.base_price_cents !== null ? Number(row.base_price_cents) : null,
    pricing_models: row.pricing_models ?? [],
    available_for_deals: row.available_for_deals,
    open_to_gifted: row.open_to_gifted,
    exclusivity_friendly: row.exclusivity_friendly,
    min_engagement_pledge:
      row.min_engagement_pledge !== null ? Number(row.min_engagement_pledge) : null,
    total_followers: Number(row.total_followers ?? 0),
    avg_engagement_rate: Number(row.avg_engagement_rate ?? 0),
    primary_platform: row.primary_platform,
    platforms_count: row.platforms_count,
    last_synced_at: row.last_synced_at,
    identity_verified_at: row.identity_verified_at,
    email_verified_at: row.email_verified_at,
    identity_verified: !!row.identity_verified_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
    score: Number(row.score ?? 0),
  };
}

interface SearchInput {
  brandId: string;
  filters: SearchQuery;
}

interface SearchOutput extends Omit<SearchResponse, "meta"> {
  /** Set by the route handler. */
  elapsedMsHint?: number;
}

export async function searchCreators(input: SearchInput): Promise<SearchOutput> {
  const { brandId, filters } = input;
  const include = new Set(filters.include);

  // Build main query
  const b = buildClauses(filters, { brandId, includeNicheClause: true });
  const score = scoreExpr(b, filters);
  const offset = (filters.page - 1) * filters.per_page;
  const limitPh = pushParam(b, filters.per_page);
  const offsetPh = pushParam(b, offset);

  const ctesSql = b.ctes.length ? `WITH ${b.ctes.join(",")}` : "";
  const sql = `
    ${ctesSql}
    SELECT
      c.id, c.status, c.display_name, c.handle::text AS handle, c.bio,
      c.avatar_url, c.banner_url,
      c.country_code, c.region, c.city, c.timezone, c.languages,
      c.primary_content_style, c.content_style_tags, c.audience_demo,
      c.rate_card, c.base_price_cents, c.pricing_models,
      c.available_for_deals, c.open_to_gifted, c.exclusivity_friendly,
      c.min_engagement_pledge,
      c.total_followers, c.avg_engagement_rate,
      c.primary_platform, c.platforms_count, c.last_synced_at,
      c.identity_verified_at, c.email_verified_at,
      c.created_at, c.updated_at,
      ${score} AS score,
      COUNT(*) OVER() AS _total
    FROM creators c
    WHERE ${b.where.join(" AND ")}
    ${orderBy(filters.sort)}
    LIMIT ${limitPh} OFFSET ${offsetPh}
  `;

  type DbRow = DbCreatorRow & { _total: string };
  const result = await query<DbRow>(sql, b.params);
  const total = Number(result.rows[0]?._total ?? 0);
  const totalPages = Math.max(1, Math.ceil(total / filters.per_page));

  const data = result.rows.map((r) => rowToResult(r, include.has("rate_card")));

  // Hydrate (batched single-roundtrip joins).
  const ids = data.map((d) => d.id);
  if (ids.length > 0) {
    if (include.has("platforms")) {
      const platRes = await query<{
        creator_id: string;
        platform: PlatformKind;
        handle: string;
        url: string;
        followers: string;
        avg_views_30d: string;
        engagement_rate: string;
        verified: boolean;
        is_dormant: boolean;
      }>(
        `SELECT creator_id, platform, handle, url,
                followers, avg_views_30d, engagement_rate,
                verified_at IS NOT NULL AS verified,
                is_dormant
           FROM creator_platforms
          WHERE creator_id = ANY($1::uuid[])
          ORDER BY followers DESC`,
        [ids],
      );
      const byCreator = new Map<string, CreatorPlatformPublic[]>();
      for (const r of platRes.rows) {
        const list = byCreator.get(r.creator_id) ?? [];
        list.push({
          platform: r.platform,
          handle: r.handle,
          url: r.url,
          followers: Number(r.followers),
          avg_views_30d: Number(r.avg_views_30d),
          engagement_rate: Number(r.engagement_rate),
          verified: r.verified,
          is_dormant: r.is_dormant,
        });
        byCreator.set(r.creator_id, list);
      }
      for (const c of data) c.platforms = byCreator.get(c.id) ?? [];
    }

    if (include.has("niches")) {
      const nicheRes = await query<{
        creator_id: string;
        id: string;
        slug: string;
        label: string;
        path: string;
        is_primary: boolean;
        weight: string;
      }>(
        `SELECT cn.creator_id, n.id, n.slug, n.label, n.path::text AS path,
                cn.is_primary, cn.weight
           FROM creator_niches cn
           JOIN niche_taxonomy n ON n.id = cn.niche_id
          WHERE cn.creator_id = ANY($1::uuid[])
          ORDER BY cn.is_primary DESC, cn.weight DESC`,
        [ids],
      );
      const byCreator = new Map<string, CreatorNicheHydrated[]>();
      for (const r of nicheRes.rows) {
        const list = byCreator.get(r.creator_id) ?? [];
        list.push({
          id: r.id,
          slug: r.slug,
          label: r.label,
          path: r.path,
          is_primary: r.is_primary,
          weight: Number(r.weight),
        });
        byCreator.set(r.creator_id, list);
      }
      for (const c of data) c.niches = byCreator.get(c.id) ?? [];
    }

    if (include.has("tags")) {
      const tagRes = await query<{ creator_id: string; tag: string }>(
        `SELECT creator_id, tag FROM creator_tags WHERE creator_id = ANY($1::uuid[])`,
        [ids],
      );
      const byCreator = new Map<string, string[]>();
      for (const r of tagRes.rows) {
        const list = byCreator.get(r.creator_id) ?? [];
        list.push(r.tag);
        byCreator.set(r.creator_id, list);
      }
      for (const c of data) c.tags = byCreator.get(c.id) ?? [];
    }
  }

  const facets = await computeFacets(filters, brandId, total);

  const pagination: SearchPagination = {
    page: filters.page,
    per_page: filters.per_page,
    total,
    total_pages: totalPages,
    next_cursor: null,
    has_next: filters.page < totalPages,
  };

  return { data, pagination, facets };
}

/**
 * Facets. Cheaper variants of the main query, grouped on each dimension.
 * For a true filter-aware facet, drop the WHERE clause for the dimension
 * being faceted. Phase 1: we apply all current WHERE clauses.
 */
async function computeFacets(
  q: SearchQuery,
  brandId: string,
  totalKnown: number,
): Promise<SearchFacets> {
  if (totalKnown === 0) {
    return {
      niches: [],
      platforms: [],
      countries: [],
      content_styles: [],
      follower_buckets: [],
      price_buckets: [],
    };
  }

  const b = buildClauses(q, { brandId, includeNicheClause: true });
  const ctesSql = b.ctes.length ? `WITH base AS (
    SELECT c.id, c.country_code, c.content_style_tags, c.total_followers, c.base_price_cents
    FROM creators c
    WHERE ${b.where.join(" AND ")}
  ), ${b.ctes.join(",")}` : `WITH base AS (
    SELECT c.id, c.country_code, c.content_style_tags, c.total_followers, c.base_price_cents
    FROM creators c
    WHERE ${b.where.join(" AND ")}
  )`;

  const params = b.params;

  const [niches, platforms, countries, styles, followers, prices] = await Promise.all([
    query<{ id: string; slug: string; label: string; count: string }>(
      `${ctesSql}
       SELECT n.id, n.slug, n.label, COUNT(DISTINCT cn.creator_id)::text AS count
         FROM creator_niches cn
         JOIN niche_taxonomy n ON n.id = cn.niche_id
        WHERE cn.creator_id IN (SELECT id FROM base)
          AND n.level <= 2
        GROUP BY n.id, n.slug, n.label
        ORDER BY count DESC NULLS LAST
        LIMIT 30`,
      params,
    ),
    query<{ platform: PlatformKind; count: string }>(
      `${ctesSql}
       SELECT cp.platform, COUNT(DISTINCT cp.creator_id)::text AS count
         FROM creator_platforms cp
        WHERE cp.creator_id IN (SELECT id FROM base)
        GROUP BY cp.platform
        ORDER BY count DESC`,
      params,
    ),
    query<{ code: string; count: string }>(
      `${ctesSql}
       SELECT country_code AS code, COUNT(*)::text AS count
         FROM base WHERE country_code IS NOT NULL
        GROUP BY country_code
        ORDER BY count DESC
        LIMIT 30`,
      params,
    ),
    query<{ style: ContentStyle; count: string }>(
      `${ctesSql}
       SELECT s AS style, COUNT(*)::text AS count
         FROM base, unnest(content_style_tags) AS s
        GROUP BY s
        ORDER BY count DESC`,
      params,
    ),
    query<{ bucket: number; count: string }>(
      `${ctesSql}
       SELECT
         CASE
           WHEN total_followers < 10000   THEN 0
           WHEN total_followers < 100000  THEN 1
           WHEN total_followers < 1000000 THEN 2
           ELSE 3
         END AS bucket,
         COUNT(*)::text AS count
       FROM base
       GROUP BY bucket
       ORDER BY bucket`,
      params,
    ),
    query<{ bucket: number; count: string }>(
      `${ctesSql}
       SELECT
         CASE
           WHEN base_price_cents IS NULL          THEN -1
           WHEN base_price_cents < 100000          THEN 0
           WHEN base_price_cents < 500000          THEN 1
           ELSE 2
         END AS bucket,
         COUNT(*)::text AS count
       FROM base
       GROUP BY bucket
       ORDER BY bucket`,
      params,
    ),
  ]);

  const followerBuckets: SearchFacets["follower_buckets"] = [
    { min: 0, max: 10_000, count: 0 },
    { min: 10_000, max: 100_000, count: 0 },
    { min: 100_000, max: 1_000_000, count: 0 },
    { min: 1_000_000, max: null, count: 0 },
  ];
  for (const r of followers.rows) {
    const idx = Number(r.bucket);
    const bkt = followerBuckets[idx];
    if (bkt) bkt.count = Number(r.count);
  }

  const priceBuckets: SearchFacets["price_buckets"] = [
    { min_cents: 0, max_cents: 100_000, count: 0 },
    { min_cents: 100_000, max_cents: 500_000, count: 0 },
    { min_cents: 500_000, max_cents: null, count: 0 },
  ];
  for (const r of prices.rows) {
    const idx = Number(r.bucket);
    if (idx >= 0 && priceBuckets[idx]) priceBuckets[idx].count = Number(r.count);
  }

  return {
    niches: niches.rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      label: r.label,
      count: Number(r.count),
    })),
    platforms: platforms.rows.map((r) => ({
      platform: r.platform,
      count: Number(r.count),
    })),
    countries: countries.rows.map((r) => ({
      code: r.code,
      count: Number(r.count),
    })),
    content_styles: styles.rows.map((r) => ({
      style: r.style,
      count: Number(r.count),
    })),
    follower_buckets: followerBuckets,
    price_buckets: priceBuckets,
  };
}
