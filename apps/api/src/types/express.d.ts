/**
 * Global Express request augmentation for auth context.
 * Mirrors the runtime shape set by middleware/auth.ts.
 */
import type { AuthUser, AuthBrand } from "../middleware/auth";

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      brand?: AuthBrand;
      creatorId?: string;
    }
  }
}

export {};
