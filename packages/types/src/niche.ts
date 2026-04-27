/**
 * Niche taxonomy types.
 * The DB stores a self-referencing tree with `ltree` paths; the frontend
 * mirrors this as a `NicheNode` tree from `@creatordeck/taxonomy`.
 */

export interface NicheTaxonomy {
  id: string;
  parent_id: string | null;
  slug: string;
  label: string;
  description: string | null;
  level: number;
  /** Dotted ltree path: e.g. `sports.extreme_sports.skydiving` */
  path: string;
  sort_order: number;
  is_active: boolean;
  icon: string | null;
  search_aliases: string[];
  creator_count: number;
  created_at: string;
  updated_at: string;
}

/**
 * In-memory tree node used by `packages/taxonomy` and the UI.
 * Slugs are stable; labels and descriptions are editable in the DB.
 */
export interface NicheNode {
  slug: string;
  label: string;
  description?: string;
  icon?: string;
  aliases?: string[];
  children?: NicheNode[];
}

/**
 * Per-creator niche assignment with weight & primary flag.
 */
export interface CreatorNiche {
  creator_id: string;
  niche_id: string;
  weight: number;
  is_primary: boolean;
  source: "self" | "admin" | "ml";
  created_at: string;
}

/**
 * Hydrated niche on a creator profile (joined from `niche_taxonomy`).
 */
export interface CreatorNicheHydrated {
  id: string;
  slug: string;
  label: string;
  path: string;
  is_primary: boolean;
  weight: number;
}
