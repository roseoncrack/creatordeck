-- ============================================================
-- 0010_triggers_functions.sql
-- Cross-cutting triggers + helper functions.
-- ============================================================

-- Generic updated_at maintainer
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END $$;

-- Apply to every owned table
DO $$
DECLARE t TEXT;
BEGIN
  FOR t IN SELECT tablename FROM pg_tables
           WHERE schemaname = 'public'
             AND tablename IN (
               'users','brands','creators','niche_taxonomy','creator_niches',
               'creator_platforms','creator_tags','brand_searches','pitches','deals'
             )
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS trg_%I_updated ON %I;', t, t);
    EXECUTE format(
      'CREATE TRIGGER trg_%I_updated BEFORE UPDATE ON %I
         FOR EACH ROW EXECUTE FUNCTION set_updated_at();', t, t);
  END LOOP;
END $$;


-- Refresh denormalized aggregates on `creators` from `creator_platforms`.
-- Called after sync jobs in Phase 2; safe to call any time.
CREATE OR REPLACE FUNCTION refresh_creator_aggregates(p_creator_id UUID)
RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  UPDATE creators c
  SET
    total_followers     = COALESCE(s.total_followers, 0),
    avg_engagement_rate = COALESCE(s.weighted_er, 0),
    primary_platform    = s.primary_platform,
    platforms_count     = COALESCE(s.platforms_count, 0),
    last_synced_at      = NOW()
  FROM (
    SELECT
      cp.creator_id,
      SUM(cp.followers)::BIGINT AS total_followers,
      CASE WHEN SUM(cp.followers) > 0
           THEN SUM(cp.engagement_rate * cp.followers) / SUM(cp.followers)
           ELSE 0 END AS weighted_er,
      (SELECT platform FROM creator_platforms
        WHERE creator_id = p_creator_id AND verified_at IS NOT NULL
        ORDER BY followers DESC LIMIT 1) AS primary_platform,
      COUNT(*) AS platforms_count
    FROM creator_platforms cp
    WHERE cp.creator_id = p_creator_id AND cp.verified_at IS NOT NULL
    GROUP BY cp.creator_id
  ) s
  WHERE c.id = p_creator_id;
END $$;


-- Maintain search_tsv on creators via trigger (unaccent not immutable, can't use GENERATED ALWAYS)
CREATE OR REPLACE FUNCTION creators_search_tsv_update()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.search_tsv :=
    setweight(to_tsvector('simple', unaccent(coalesce(NEW.display_name,''))), 'A') ||
    setweight(to_tsvector('simple', unaccent(coalesce(NEW.handle::text,''))), 'A') ||
    setweight(to_tsvector('english', unaccent(coalesce(NEW.bio,''))), 'B');
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_creators_search_tsv ON creators;
CREATE TRIGGER trg_creators_search_tsv
  BEFORE INSERT OR UPDATE OF display_name, handle, bio ON creators
  FOR EACH ROW EXECUTE FUNCTION creators_search_tsv_update();

-- Refresh `niche_taxonomy.creator_count`. Called nightly.
CREATE OR REPLACE FUNCTION refresh_niche_counts()
RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  UPDATE niche_taxonomy n
  SET creator_count = COALESCE(s.cnt, 0)
  FROM (
    SELECT cn.niche_id, COUNT(DISTINCT cn.creator_id) AS cnt
    FROM creator_niches cn
    JOIN creators c ON c.id = cn.creator_id
    WHERE c.status = 'active' AND c.deleted_at IS NULL
    GROUP BY cn.niche_id
  ) s
  WHERE n.id = s.niche_id;

  -- Zero out anything that has no matches
  UPDATE niche_taxonomy n
  SET creator_count = 0
  WHERE n.id NOT IN (
    SELECT DISTINCT niche_id FROM creator_niches cn
    JOIN creators c ON c.id = cn.creator_id
    WHERE c.status = 'active' AND c.deleted_at IS NULL
  );
END $$;
