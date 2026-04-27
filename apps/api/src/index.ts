import "dotenv/config";
/**
 * CreatorDeck API entry point.
 *
 * Boots Express with security middleware, mounts /api routers, and
 * starts an HTTP server. Graceful shutdown closes the pg pool.
 */
import compression from "compression";
import cors from "cors";
import express, { type Request, type Response } from "express";
import helmet from "helmet";
import { config } from "./config";
import { closePool } from "./db/client";
import { errorHandler } from "./middleware/error-handler";
import api from "./routes";

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(
  cors({
    origin: config.WEB_ORIGIN.split(",").map((s) => s.trim()),
    credentials: true,
  }),
);
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Lightweight request log (skip /health to keep noise down).
app.use((req, _res, next) => {
  if (req.path !== "/api/health") {
    console.info(`[req] ${req.method} ${req.path}`);
  }
  next();
});

app.get("/", (_req: Request, res: Response) => {
  res.json({ name: "creatordeck-api", docs: "/api/health" });
});

app.use("/api", api);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "not_found", message: "Route not found" });
});

app.use(errorHandler);

const server = app.listen(config.PORT, () => {
  console.info(`[api] listening on :${config.PORT} (${config.NODE_ENV})`);
});

function shutdown(signal: string): void {
  console.info(`[api] received ${signal}, shutting down`);
  server.close(() => {
    closePool().finally(() => process.exit(0));
  });
  // Hard kill after 10s
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

export { app };
