/**
 * Creator routes:
 *   GET  /api/creators/:handle              public profile
 *   POST /api/creators                      upsert own (creator-only)
 *   POST /api/creators/me/platforms         link a platform (creator-only)
 *   GET  /api/creators/me                   own profile
 */
import { Router } from "express";
import {
  getCreatorByHandle,
  upsertOwnCreator,
  linkPlatform,
  upsertCreatorSchema,
  linkPlatformSchema,
} from "../services/creator.service";
import { requireCreator, optionalAuth } from "../middleware/auth";
import { HttpError } from "../middleware/error-handler";

const router = Router();

router.get("/me", requireCreator, async (req, res, next) => {
  try {
    if (!req.creatorId) {
      res.json({ data: null });
      return;
    }
    // Reuse handle lookup by first reading the handle.
    const r = await import("../db/client").then((m) =>
      m.query<{ handle: string }>(
        `SELECT handle::text AS handle FROM creators WHERE id = $1`,
        [req.creatorId],
      ),
    );
    const handle = r.rows[0]?.handle;
    if (!handle) {
      res.json({ data: null });
      return;
    }
    const profile = await getCreatorByHandle(handle);
    res.json({ data: profile });
  } catch (err) {
    next(err);
  }
});

router.post("/", requireCreator, async (req, res, next) => {
  try {
    const input = upsertCreatorSchema.parse(req.body);
    const profile = await upsertOwnCreator(req.user!.id, input);
    res.status(201).json({ data: profile });
  } catch (err) {
    next(err);
  }
});

router.post("/me/platforms", requireCreator, async (req, res, next) => {
  try {
    if (!req.creatorId) {
      throw new HttpError(404, "not_found", "Creator profile not found — create it first");
    }
    const input = linkPlatformSchema.parse(req.body);
    const linked = await linkPlatform(req.creatorId, input);
    res.status(201).json({ data: linked });
  } catch (err) {
    next(err);
  }
});

router.get("/:handle", optionalAuth, async (req, res, next) => {
  try {
    const handle = req.params.handle;
    const profile = await getCreatorByHandle(handle);
    if (!profile) throw new HttpError(404, "not_found", "Creator not found");
    res.json({ data: profile });
  } catch (err) {
    next(err);
  }
});

export default router;
