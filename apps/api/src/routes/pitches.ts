/**
 * Pitch routes:
 *   POST /api/pitches            (brand) send a pitch
 *   GET  /api/pitches            (brand) list pitches sent
 *   GET  /api/pitches/inbox      (creator) list pitches received
 *   POST /api/pitches/:id/decision  (creator) accept | decline
 */
import { Router } from "express";
import { z } from "zod";
import { query } from "../db/client";
import { requireBrand, requireCreator } from "../middleware/auth";
import { HttpError } from "../middleware/error-handler";
import type { Pitch } from "@creatordeck/types";

const router = Router();

const sendPitchSchema = z.object({
  creator_id: z.string().uuid(),
  subject: z.string().min(3).max(140),
  message: z.string().min(10).max(5_000),
  proposed_budget_cents: z.number().int().min(0).optional(),
  proposed_deliverables: z
    .array(
      z.object({
        platform: z.string().min(1),
        type: z.string().min(1),
        quantity: z.number().int().min(1).default(1),
      }),
    )
    .default([]),
  search_id: z.string().uuid().optional(),
});

router.post("/", requireBrand, async (req, res, next) => {
  try {
    const input = sendPitchSchema.parse(req.body);
    const r = await query<Pitch>(
      `INSERT INTO pitches
         (brand_id, creator_id, search_id, subject, message,
          proposed_budget_cents, proposed_deliverables, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,'sent')
       RETURNING id, brand_id, creator_id, search_id, subject, message,
                 proposed_budget_cents, proposed_deliverables,
                 status, viewed_at, replied_at, decided_at, expires_at,
                 created_at, updated_at`,
      [
        req.brand!.id,
        input.creator_id,
        input.search_id ?? null,
        input.subject,
        input.message,
        input.proposed_budget_cents ?? null,
        JSON.stringify(input.proposed_deliverables),
      ],
    );
    res.status(201).json({ data: r.rows[0] });
  } catch (err) {
    next(err);
  }
});

router.get("/", requireBrand, async (req, res, next) => {
  try {
    const r = await query<Pitch>(
      `SELECT id, brand_id, creator_id, search_id, subject, message,
              proposed_budget_cents, proposed_deliverables,
              status, viewed_at, replied_at, decided_at, expires_at,
              created_at, updated_at
         FROM pitches
        WHERE brand_id = $1
        ORDER BY created_at DESC
        LIMIT 100`,
      [req.brand!.id],
    );
    res.json({ data: r.rows });
  } catch (err) {
    next(err);
  }
});

router.get("/inbox", requireCreator, async (req, res, next) => {
  try {
    if (!req.creatorId) {
      res.json({ data: [] });
      return;
    }
    const r = await query<Pitch>(
      `SELECT id, brand_id, creator_id, search_id, subject, message,
              proposed_budget_cents, proposed_deliverables,
              status, viewed_at, replied_at, decided_at, expires_at,
              created_at, updated_at
         FROM pitches
        WHERE creator_id = $1
        ORDER BY created_at DESC
        LIMIT 100`,
      [req.creatorId],
    );
    res.json({ data: r.rows });
  } catch (err) {
    next(err);
  }
});

const decisionSchema = z.object({
  decision: z.enum(["accepted", "declined"]),
  message: z.string().max(2000).optional(),
});

router.post("/:id/decision", requireCreator, async (req, res, next) => {
  try {
    const input = decisionSchema.parse(req.body);
    if (!req.creatorId) throw new HttpError(403, "forbidden", "No creator profile");
    const r = await query<Pitch>(
      `UPDATE pitches SET status = $1, decided_at = NOW(), replied_at = NOW()
        WHERE id = $2 AND creator_id = $3
        RETURNING id, brand_id, creator_id, search_id, subject, message,
                  proposed_budget_cents, proposed_deliverables,
                  status, viewed_at, replied_at, decided_at, expires_at,
                  created_at, updated_at`,
      [input.decision, req.params.id, req.creatorId],
    );
    if (!r.rows[0]) throw new HttpError(404, "not_found", "Pitch not found");
    res.json({ data: r.rows[0] });
  } catch (err) {
    next(err);
  }
});

export default router;
