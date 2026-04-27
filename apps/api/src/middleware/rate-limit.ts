/**
 * Redis token-bucket-ish rate limiter (fixed window). Falls open if Redis
 * isn't configured so dev doesn't break.
 */
import type { NextFunction, Request, Response } from "express";
import { getRedis } from "../lib/cache";
import { config } from "../config";
import { HttpError } from "./error-handler";

interface RateLimitOptions {
  /** How many requests allowed per window. */
  limit: number;
  /** Window length in seconds. */
  window: number;
  /** Function to derive a per-caller key. */
  key: (req: Request) => string;
}

export function rateLimit(opts: RateLimitOptions) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!config.ENABLE_RATE_LIMIT) return next();
    const redis = getRedis();
    if (!redis) return next();

    const baseKey = opts.key(req);
    const now = Math.floor(Date.now() / 1000);
    const bucket = Math.floor(now / opts.window);
    const k = `rl:${baseKey}:${bucket}`;

    try {
      const count = await redis.incr(k);
      if (count === 1) await redis.expire(k, opts.window + 5);
      const remaining = Math.max(0, opts.limit - count);

      res.setHeader("X-RateLimit-Limit", String(opts.limit));
      res.setHeader("X-RateLimit-Remaining", String(remaining));
      res.setHeader("X-RateLimit-Reset", String((bucket + 1) * opts.window));

      if (count > opts.limit) {
        const retryAfter = (bucket + 1) * opts.window - now;
        res.setHeader("Retry-After", String(retryAfter));
        const err = new HttpError(
          429,
          "rate_limited",
          `${opts.limit} requests per ${opts.window}s exceeded`,
        );
        (err as unknown as { retry_after_sec: number }).retry_after_sec = retryAfter;
        throw err;
      }
      next();
    } catch (err) {
      if (err instanceof HttpError) return next(err);
      // Redis hiccup → fail open.
      console.warn("[rate-limit] failed open:", (err as Error).message);
      next();
    }
  };
}
