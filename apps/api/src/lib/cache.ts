/**
 * Tiny Redis-backed cache wrapper. Falls back to no-op when REDIS_URL
 * isn't set so dev works without a Redis instance.
 */
import Redis from "ioredis";
import { createHash } from "node:crypto";
import { config } from "../config";

let client: Redis | null = null;

function getClient(): Redis | null {
  if (client) return client;
  if (!config.REDIS_URL) return null;
  client = new Redis(config.REDIS_URL, {
    maxRetriesPerRequest: 2,
    lazyConnect: false,
  });
  client.on("error", (err) => console.error("[redis]", err.message));
  return client;
}

export async function getCachedOrCompute<T>(
  key: string,
  compute: () => Promise<T>,
  opts: { ttlSec: number } = { ttlSec: 60 },
): Promise<{ value: T; cached: boolean }> {
  if (!config.ENABLE_SEARCH_CACHE) {
    const value = await compute();
    return { value, cached: false };
  }

  const c = getClient();
  if (!c) {
    const value = await compute();
    return { value, cached: false };
  }

  try {
    const raw = await c.get(key);
    if (raw) {
      return { value: JSON.parse(raw) as T, cached: true };
    }
  } catch (err) {
    console.warn("[cache] get failed", err);
  }

  const value = await compute();
  try {
    await c.setex(key, opts.ttlSec, JSON.stringify(value));
  } catch (err) {
    console.warn("[cache] set failed", err);
  }
  return { value, cached: false };
}

/**
 * Stable JSON-based hash for cache keys. Keys are sorted recursively.
 */
export function stableHash(input: unknown): string {
  return createHash("sha1").update(stableStringify(input)).digest("hex");
}

function stableStringify(v: unknown): string {
  if (v === null || typeof v !== "object") return JSON.stringify(v);
  if (Array.isArray(v)) return `[${v.map(stableStringify).join(",")}]`;
  const obj = v as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`).join(",")}}`;
}

export function getRedis(): Redis | null {
  return getClient();
}
