/**
 * Clerk JWT verification. Loads the matching `users` row plus, for
 * brand-only routes, the brand they own.
 */
import { createClerkClient, verifyToken } from "@clerk/backend";
import type { NextFunction, Request, Response } from "express";
import { config } from "../config";
import { query } from "../db/client";
import { HttpError } from "./error-handler";

const clerk = createClerkClient({ secretKey: config.CLERK_SECRET_KEY });

export interface AuthUser {
  id: string;
  clerk_user_id: string;
  email: string;
  display_name: string | null;
  role: "creator" | "brand" | "admin";
}

export interface AuthBrand {
  id: string;
  name: string;
  slug: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthUser;
    brand?: AuthBrand;
    creatorId?: string;
  }
}

function extractBearer(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header) return null;
  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token;
}

/**
 * Require a logged-in user (any role).
 */
export async function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const token = extractBearer(req);
    if (!token) throw new HttpError(401, "unauthorized", "Missing or invalid Authorization header");

    const payload = await verifyToken(token, { secretKey: config.CLERK_SECRET_KEY });
    const clerkUserId = payload.sub;
    if (!clerkUserId) throw new HttpError(401, "unauthorized", "Invalid token subject");

    const result = await query<AuthUser>(
      `SELECT id, clerk_user_id, email, display_name, role
         FROM users
        WHERE clerk_user_id = $1
        LIMIT 1`,
      [clerkUserId],
    );

    let user = result.rows[0];
    if (!user) {
      // First-touch sync from Clerk — keeps things working before the webhook fires.
      const cu = await clerk.users.getUser(clerkUserId).catch(() => null);
      if (!cu) throw new HttpError(401, "unauthorized", "Unknown user");
      const email = cu.primaryEmailAddress?.emailAddress;
      if (!email) throw new HttpError(401, "unauthorized", "User has no primary email");

      // Default to brand role; creators flip during onboarding.
      const role = (cu.publicMetadata?.role as AuthUser["role"]) ?? "brand";
      const ins = await query<AuthUser>(
        `INSERT INTO users (clerk_user_id, email, display_name, avatar_url, role)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (clerk_user_id) DO UPDATE SET email = EXCLUDED.email
         RETURNING id, clerk_user_id, email, display_name, role`,
        [clerkUserId, email, cu.fullName ?? null, cu.imageUrl ?? null, role],
      );
      user = ins.rows[0];
    }

    if (!user) throw new HttpError(401, "unauthorized", "Could not resolve user");
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Require a brand role + load the brand record.
 */
export async function requireBrand(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      await new Promise<void>((resolve, reject) =>
        requireAuth(req, res, (e) => (e ? reject(e) : resolve())),
      );
    }
    const u = req.user!;
    if (u.role !== "brand" && u.role !== "admin") {
      throw new HttpError(403, "forbidden", "Brand role required");
    }

    const brandRes = await query<AuthBrand>(
      `SELECT id, name, slug FROM brands WHERE owner_user_id = $1 LIMIT 1`,
      [u.id],
    );
    let brand = brandRes.rows[0];
    if (!brand && u.role === "brand") {
      const ins = await query<AuthBrand>(
        `INSERT INTO brands (owner_user_id, name, slug)
         VALUES ($1, $2, $3)
         RETURNING id, name, slug`,
        [u.id, u.display_name ?? "Untitled Brand", `brand-${u.id.slice(0, 8)}`],
      );
      brand = ins.rows[0];
    }
    if (!brand) throw new HttpError(403, "forbidden", "No brand attached to this user");
    req.brand = brand;
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Require a creator-role user + load creator id (if any).
 */
export async function requireCreator(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      await new Promise<void>((resolve, reject) =>
        requireAuth(req, res, (e) => (e ? reject(e) : resolve())),
      );
    }
    const u = req.user!;
    if (u.role !== "creator" && u.role !== "admin") {
      throw new HttpError(403, "forbidden", "Creator role required");
    }
    const c = await query<{ id: string }>(
      `SELECT id FROM creators WHERE user_id = $1 LIMIT 1`,
      [u.id],
    );
    req.creatorId = c.rows[0]?.id;
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Optional auth — populates req.user if a token is present, otherwise no-op.
 * Used for public endpoints that show extra info to logged-in users.
 */
export async function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  if (!extractBearer(req)) return next();
  return requireAuth(req, res, next);
}
