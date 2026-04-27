/**
 * Brand CRUD endpoints. Phase 1 keeps this minimal — owner can read +
 * update their own brand record.
 */
import { Router } from "express";
import { z } from "zod";
import { query } from "../db/client";
import { requireBrand } from "../middleware/auth";
import { HttpError } from "../middleware/error-handler";
import type { Brand } from "@creatordeck/types";

const router = Router();

router.get("/me", requireBrand, async (req, res, next) => {
  try {
    const r = await query<Brand>(
      `SELECT id, owner_user_id, name, slug, website, industry, logo_url,
              stripe_customer_id, monthly_budget_cents, created_at, updated_at
         FROM brands WHERE id = $1`,
      [req.brand!.id],
    );
    if (!r.rows[0]) throw new HttpError(404, "not_found", "Brand not found");
    res.json({ data: r.rows[0] });
  } catch (err) {
    next(err);
  }
});

const updateSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  website: z.string().url().nullable().optional(),
  industry: z.string().max(80).nullable().optional(),
  logo_url: z.string().url().nullable().optional(),
  monthly_budget_cents: z.number().int().min(0).nullable().optional(),
});

router.patch("/me", requireBrand, async (req, res, next) => {
  try {
    const input = updateSchema.parse(req.body);
    const setParts: string[] = [];
    const params: unknown[] = [];
    let i = 1;
    for (const [k, v] of Object.entries(input)) {
      if (v === undefined) continue;
      setParts.push(`${k} = $${i++}`);
      params.push(v);
    }
    if (!setParts.length) {
      res.status(400).json({ error: "validation_error", message: "No updates supplied" });
      return;
    }
    params.push(req.brand!.id);
    const r = await query<Brand>(
      `UPDATE brands SET ${setParts.join(", ")}
        WHERE id = $${params.length}
        RETURNING id, owner_user_id, name, slug, website, industry, logo_url,
                  stripe_customer_id, monthly_budget_cents, created_at, updated_at`,
      params,
    );
    res.json({ data: r.rows[0] });
  } catch (err) {
    next(err);
  }
});

export default router;
