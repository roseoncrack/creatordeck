/**
 * Mount all `/api/*` routers.
 */
import { Router } from "express";
import searchRouter from "./search";
import creatorsRouter from "./creators";
import pitchesRouter from "./pitches";
import brandsRouter from "./brands";

const api = Router();

api.get("/health", (_req, res) => {
  res.json({ ok: true, name: "creatordeck-api", version: "0.1.0" });
});

// Search lives at /api/creators/search (mounted before generic /:handle).
api.use("/creators", searchRouter);
api.use("/creators", creatorsRouter);
api.use("/pitches", pitchesRouter);
api.use("/brands", brandsRouter);

export default api;
