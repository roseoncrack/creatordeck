/**
 * Creator profile service: read public profile, upsert own profile,
 * link platforms, manage niches & tags.
 */
import { z } from "zod";
import { query, withTransaction } from "../db/client";
import {
  CONTENT_STYLES,
  PLATFORM_KINDS,
  PRICING_MODELS,
  type CreatorNicheHydrated,
  type CreatorPlatformPublic,
  type CreatorPublic,
  type PlatformKind,
} from "@creatordeck/types";
import { HttpError } from "../middleware/error-handler";

export const upsertCreatorSchema = z.object({
  display_name: z.string().min(1).max(80),
  handle: z
    .string()
    .min(2)
    .max(40)
    .regex(/^[a-zA-Z0-9_.-]+$/, "Handle can only contain letters, numbers, _ . -"),
  bio: z.string().max(2000).optional(),
  avatar_url: z.string().url().optional(),
  banner_url: z.string().url().optional(),
  country_code: z.string().length(2).optional(),
  region: z.string().max(80).optional(),
  city: z.string().max(80).optional(),
  timezone: z.string().max(60).optional(),
  languages: z.array(z.string().length(2)).max(20).default([]),
  primary_content_style: z.enum(CONTENT_STYLES).optional(),
  content_style_tags: z.array(z.enum(CONTENT_STYLES)).default([]),
  rate_card: z.record(z.string(), z.number().int().min(0)).default({}),
  base_price_cents: z.number().int().min(0).optional(),
  pricing_models: z.array(z.enum(PRICING_MODELS)).default([]),
  available_for_deals: z.boolean().default(true),
  open_to_gifted: z.boolean().default(false),
  exclusivity_friendly: z.boolean().default(false),
  min_engagement_pledge: z.number().min(0).max(1).optional(),
  niche_ids: z.array(z.string().uuid()).max(10).default([]),
  primary_niche_id: z.string().uuid().optional(),
  tags: z.array(z.string().min(1).max(40)).max(20).default([]),
});
export type UpsertCreatorInput = z.infer<typeof upsertCreatorSchema>;

export const linkPlatformSchema = z.object({
  platform: z.enum(PLATFORM_KINDS),
  handle: z.string().min(1).max(80),
  url: z.string().url(),
  followers: z.number().int().min(0).default(0),
  avg_views_30d: z.number().int().min(0).default(0),
  avg_likes_30d: z.number().int().min(0).default(0),
  avg_comments_30d: z.number().int().min(0).default(0),
  engagement_rate: z.number().min(0).max(1).default(0),
});
export type LinkPlatformInput = z.infer<typeof linkPlatformSchema>;

interface CreatorRow {
  id: string;
  status: CreatorPublic["status"];
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
  primary_content_style: CreatorPublic["primary_content_style"];
  content_style_tags: CreatorPublic["content_style_tags"];
  audience_demo: CreatorPublic["audience_demo"];
  rate_card: CreatorPublic["rate_card"];
  base_price_cents: string | null;
  pricing_models: CreatorPublic["pricing_models"];
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
}

function rowToPublic(row: CreatorRow): CreatorPublic {
  return {
    id: row.id,
    status: row.status,
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
    rate_card: row.rate_card ?? {},
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
  };
}

export async function getCreatorByHandle(handle: string): Promise<CreatorPublic | null> {
  const r = await query<CreatorRow>(
    `SELECT id, status, display_name, handle::text AS handle, bio, avatar_url, banner_url,
            country_code, region, city, timezone, languages,
            primary_content_style, content_style_tags, audience_demo,
            rate_card, base_price_cents, pricing_models,
            available_for_deals, open_to_gifted, exclusivity_friendly, min_engagement_pledge,
            total_followers, avg_engagement_rate, primary_platform, platforms_count, last_synced_at,
            identity_verified_at, email_verified_at, created_at, updated_at
       FROM creators
      WHERE handle = $1::citext AND deleted_at IS NULL
      LIMIT 1`,
    [handle],
  );
  const row = r.rows[0];
  if (!row) return null;
  const c = rowToPublic(row);

  const [pl, ni, tg] = await Promise.all([
    query<{
      platform: PlatformKind;
      handle: string;
      url: string;
      followers: string;
      avg_views_30d: string;
      engagement_rate: string;
      verified: boolean;
      is_dormant: boolean;
    }>(
      `SELECT platform, handle, url, followers, avg_views_30d, engagement_rate,
              verified_at IS NOT NULL AS verified, is_dormant
         FROM creator_platforms
        WHERE creator_id = $1
        ORDER BY followers DESC`,
      [c.id],
    ),
    query<{
      id: string;
      slug: string;
      label: string;
      path: string;
      is_primary: boolean;
      weight: string;
    }>(
      `SELECT n.id, n.slug, n.label, n.path::text AS path, cn.is_primary, cn.weight
         FROM creator_niches cn
         JOIN niche_taxonomy n ON n.id = cn.niche_id
        WHERE cn.creator_id = $1
        ORDER BY cn.is_primary DESC, cn.weight DESC`,
      [c.id],
    ),
    query<{ tag: string }>(`SELECT tag FROM creator_tags WHERE creator_id = $1`, [c.id]),
  ]);

  const platforms: CreatorPlatformPublic[] = pl.rows.map((r2) => ({
    platform: r2.platform,
    handle: r2.handle,
    url: r2.url,
    followers: Number(r2.followers),
    avg_views_30d: Number(r2.avg_views_30d),
    engagement_rate: Number(r2.engagement_rate),
    verified: r2.verified,
    is_dormant: r2.is_dormant,
  }));

  const niches: CreatorNicheHydrated[] = ni.rows.map((r2) => ({
    id: r2.id,
    slug: r2.slug,
    label: r2.label,
    path: r2.path,
    is_primary: r2.is_primary,
    weight: Number(r2.weight),
  }));

  const tags = tg.rows.map((r2) => r2.tag);
  return { ...c, platforms, niches, tags };
}

export async function upsertOwnCreator(
  userId: string,
  input: UpsertCreatorInput,
): Promise<CreatorPublic> {
  return withTransaction(async (client) => {
    // Upsert creator
    const existing = await client.query<{ id: string }>(
      `SELECT id FROM creators WHERE user_id = $1 LIMIT 1`,
      [userId],
    );
    let creatorId: string;

    if (existing.rows[0]) {
      creatorId = existing.rows[0].id;
      await client.query(
        `UPDATE creators SET
            display_name=$2, handle=$3, bio=$4, avatar_url=$5, banner_url=$6,
            country_code=$7, region=$8, city=$9, timezone=$10, languages=$11,
            primary_content_style=$12, content_style_tags=$13,
            rate_card=$14, base_price_cents=$15, pricing_models=$16,
            available_for_deals=$17, open_to_gifted=$18, exclusivity_friendly=$19,
            min_engagement_pledge=$20,
            status = CASE WHEN status='draft' THEN 'pending'::creator_status ELSE status END
          WHERE id=$1`,
        [
          creatorId,
          input.display_name,
          input.handle,
          input.bio ?? null,
          input.avatar_url ?? null,
          input.banner_url ?? null,
          input.country_code ?? null,
          input.region ?? null,
          input.city ?? null,
          input.timezone ?? null,
          input.languages,
          input.primary_content_style ?? null,
          input.content_style_tags,
          input.rate_card,
          input.base_price_cents ?? null,
          input.pricing_models,
          input.available_for_deals,
          input.open_to_gifted,
          input.exclusivity_friendly,
          input.min_engagement_pledge ?? null,
        ],
      );
    } else {
      const ins = await client.query<{ id: string }>(
        `INSERT INTO creators
          (user_id, display_name, handle, bio, avatar_url, banner_url,
           country_code, region, city, timezone, languages,
           primary_content_style, content_style_tags,
           rate_card, base_price_cents, pricing_models,
           available_for_deals, open_to_gifted, exclusivity_friendly,
           min_engagement_pledge, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,'draft')
         RETURNING id`,
        [
          userId,
          input.display_name,
          input.handle,
          input.bio ?? null,
          input.avatar_url ?? null,
          input.banner_url ?? null,
          input.country_code ?? null,
          input.region ?? null,
          input.city ?? null,
          input.timezone ?? null,
          input.languages,
          input.primary_content_style ?? null,
          input.content_style_tags,
          input.rate_card,
          input.base_price_cents ?? null,
          input.pricing_models,
          input.available_for_deals,
          input.open_to_gifted,
          input.exclusivity_friendly,
          input.min_engagement_pledge ?? null,
        ],
      );
      const row = ins.rows[0];
      if (!row) throw new HttpError(500, "internal_error", "Insert returned no row");
      creatorId = row.id;
    }

    // Replace niches
    await client.query(`DELETE FROM creator_niches WHERE creator_id = $1`, [creatorId]);
    if (input.niche_ids.length) {
      const values: string[] = [];
      const params: unknown[] = [creatorId];
      let i = 2;
      for (const nid of input.niche_ids) {
        params.push(nid, nid === input.primary_niche_id);
        values.push(`($1, $${i++}::uuid, 1.00, $${i++}::boolean, 'self')`);
      }
      await client.query(
        `INSERT INTO creator_niches (creator_id, niche_id, weight, is_primary, source)
         VALUES ${values.join(", ")}`,
        params,
      );
    }

    // Replace tags
    await client.query(`DELETE FROM creator_tags WHERE creator_id = $1`, [creatorId]);
    if (input.tags.length) {
      const values: string[] = [];
      const params: unknown[] = [creatorId];
      let i = 2;
      for (const tag of input.tags) {
        params.push(tag);
        values.push(`($1, $${i++}::citext, 'self')`);
      }
      await client.query(
        `INSERT INTO creator_tags (creator_id, tag, source) VALUES ${values.join(", ")}`,
        params,
      );
    }

    // Refresh aggregates from any existing platform rows.
    await client.query(`SELECT refresh_creator_aggregates($1)`, [creatorId]);

    const final = await client.query<CreatorRow>(
      `SELECT id, status, display_name, handle::text AS handle, bio, avatar_url, banner_url,
              country_code, region, city, timezone, languages,
              primary_content_style, content_style_tags, audience_demo,
              rate_card, base_price_cents, pricing_models,
              available_for_deals, open_to_gifted, exclusivity_friendly, min_engagement_pledge,
              total_followers, avg_engagement_rate, primary_platform, platforms_count, last_synced_at,
              identity_verified_at, email_verified_at, created_at, updated_at
         FROM creators WHERE id = $1`,
      [creatorId],
    );
    const row = final.rows[0];
    if (!row) throw new HttpError(500, "internal_error", "Creator not found after upsert");
    return rowToPublic(row);
  });
}

export async function linkPlatform(
  creatorId: string,
  input: LinkPlatformInput,
): Promise<CreatorPlatformPublic> {
  await query(
    `INSERT INTO creator_platforms
       (creator_id, platform, handle, url, followers, avg_views_30d,
        avg_likes_30d, avg_comments_30d, engagement_rate)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     ON CONFLICT (creator_id, platform) DO UPDATE SET
       handle=EXCLUDED.handle,
       url=EXCLUDED.url,
       followers=EXCLUDED.followers,
       avg_views_30d=EXCLUDED.avg_views_30d,
       avg_likes_30d=EXCLUDED.avg_likes_30d,
       avg_comments_30d=EXCLUDED.avg_comments_30d,
       engagement_rate=EXCLUDED.engagement_rate`,
    [
      creatorId,
      input.platform,
      input.handle,
      input.url,
      input.followers,
      input.avg_views_30d,
      input.avg_likes_30d,
      input.avg_comments_30d,
      input.engagement_rate,
    ],
  );
  await query(`SELECT refresh_creator_aggregates($1)`, [creatorId]);
  return {
    platform: input.platform,
    handle: input.handle,
    url: input.url,
    followers: input.followers,
    avg_views_30d: input.avg_views_30d,
    engagement_rate: input.engagement_rate,
    verified: false,
    is_dormant: false,
  };
}
