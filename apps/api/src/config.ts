/**
 * Validated environment configuration. Fail fast on boot if anything
 * required is missing — better a noisy error than mystery 500s later.
 */
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DATABASE_REPLICA_URL: z.string().optional(),

  REDIS_URL: z.string().optional(),

  CLERK_SECRET_KEY: z.string().min(1, "CLERK_SECRET_KEY is required"),
  CLERK_PUBLISHABLE_KEY: z.string().min(1, "CLERK_PUBLISHABLE_KEY is required"),
  CLERK_WEBHOOK_SECRET: z.string().optional(),

  // Feature flags
  ENABLE_SEARCH_CACHE: z
    .union([z.literal("true"), z.literal("false")])
    .default("true")
    .transform((v) => v === "true"),
  ENABLE_RATE_LIMIT: z
    .union([z.literal("true"), z.literal("false")])
    .default("true")
    .transform((v) => v === "true"),

  // CORS
  WEB_ORIGIN: z.string().default("http://localhost:3000"),

  // Phase 2 / 3 (optional)
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  TOKEN_ENCRYPTION_KEY: z.string().optional(),

  // Observability
  SENTRY_DSN: z.string().optional(),
  AXIOM_TOKEN: z.string().optional(),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error("[config] Invalid environment:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const config = parsed.data;
export type Config = typeof config;
