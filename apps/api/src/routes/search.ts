/**
 * GET /api/creators/search
 *
 * The hot path. Validates input, hits the cache, runs the search service,
 * and returns the standard `SearchResponse`.
 */
import { Router } from "express";
import { ulid } from "ulid";
import { searchQuerySchema } from "./search.schema";
import { searchCreators } from "../services/search.service";
import { requireBrand } from "../middleware/auth";
import { rateLimit } from "../middleware/rate-limit";
import { getCachedOrCompute, stableHash } from "../lib/cache";
import type { SearchResponse } from "@creatordeck/types";

const router = Router();

router.get(
  "/search",
  requireBrand,
  rateLimit({
    key: (req) => `search:${req.brand?.id ?? "anon"}`,
    limit: 60,
    window: 60,
  }),
  async (req, res, next) => {
    const startedAt = Date.now();
    try {
      const params = searchQuerySchema.parse(req.query);
      const brandId = req.brand!.id;

      const cacheKey = `search:${brandId}:${stableHash(params)}`;
      const { value, cached } = await getCachedOrCompute(
        cacheKey,
        () => searchCreators({ brandId, filters: params }),
        { ttlSec: 60 },
      );

      const elapsed = Date.now() - startedAt;
      const response: SearchResponse = {
        ...value,
        meta: {
          query_id: ulid(),
          elapsed_ms: elapsed,
          cached,
          applied_filters: params,
        },
      };

      res.setHeader("Cache-Control", "private, max-age=60");
      res.json(response);
    } catch (err) {
      next(err);
    }
  },
);

export default router;
