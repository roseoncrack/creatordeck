import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ulid } from "ulid";
import type { ApiError } from "@creatordeck/types";

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly fields?: Record<string, string>,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof ZodError) {
    const fields: Record<string, string> = {};
    for (const issue of err.issues) {
      const key = issue.path.join(".") || "_root";
      fields[key] = issue.message;
    }
    const body: ApiError = {
      error: "validation_error",
      message: err.issues[0]?.message ?? "Validation failed",
      fields,
    };
    res.status(400).json(body);
    return;
  }

  if (err instanceof HttpError) {
    const body: ApiError = {
      error: err.code,
      message: err.message,
      fields: err.fields,
    };
    res.status(err.status).json(body);
    return;
  }

  const requestId = ulid();
  const e = err as Error;
  console.error(`[error ${requestId}]`, e?.stack ?? e);
  const body: ApiError = {
    error: "internal_error",
    message: "Something broke. We've been notified.",
    request_id: requestId,
  };
  res.status(500).json(body);
};
