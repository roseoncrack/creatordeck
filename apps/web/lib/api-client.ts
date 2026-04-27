/**
 * Typed fetch wrapper around the Express API.
 *
 * On the server, we read API_URL directly + forward the Clerk session token.
 * On the client, fetches go to the Next.js process which proxies through
 * the same env (NEXT_PUBLIC_API_URL).
 */
import type {
  ApiError,
  CreatorPublic,
  Pitch,
  SearchFilters,
  SearchResponse,
} from "@creatordeck/types";

const API_URL =
  (typeof window === "undefined"
    ? process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL
    : process.env.NEXT_PUBLIC_API_URL) ?? "http://localhost:4000";

export interface FetchOptions {
  /** Bearer token (Clerk JWT). */
  token?: string;
  /** Forwarded for SSR cache control. */
  revalidate?: number;
  /** AbortSignal for client cancellation. */
  signal?: AbortSignal;
}

export class ApiClientError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: ApiError,
  ) {
    super(body.message);
    this.name = "ApiClientError";
  }
}

async function request<T>(
  path: string,
  init: RequestInit & { revalidate?: number } = {},
  opts: FetchOptions = {},
): Promise<T> {
  const url = `${API_URL.replace(/\/$/, "")}${path}`;
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (opts.token) headers.set("Authorization", `Bearer ${opts.token}`);

  const res = await fetch(url, {
    ...init,
    headers,
    signal: opts.signal,
    next: opts.revalidate !== undefined ? { revalidate: opts.revalidate } : undefined,
  });

  const text = await res.text();
  const json = text ? (JSON.parse(text) as unknown) : null;

  if (!res.ok) {
    throw new ApiClientError(res.status, (json as ApiError) ?? {
      error: "request_failed",
      message: res.statusText,
    });
  }
  return json as T;
}

/** Build a query string from a SearchFilters object. */
export function buildSearchQuery(filters: SearchFilters): string {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(filters)) {
    if (v === undefined || v === null || v === "") continue;
    if (Array.isArray(v)) {
      for (const item of v) params.append(k, String(item));
    } else if (typeof v === "boolean") {
      params.set(k, v ? "true" : "false");
    } else {
      params.set(k, String(v));
    }
  }
  const s = params.toString();
  return s ? `?${s}` : "";
}

export async function searchCreators(
  filters: SearchFilters,
  opts: FetchOptions = {},
): Promise<SearchResponse> {
  return request<SearchResponse>(
    `/api/creators/search${buildSearchQuery(filters)}`,
    { method: "GET" },
    opts,
  );
}

export async function getCreator(
  handle: string,
  opts: FetchOptions = {},
): Promise<{ data: CreatorPublic }> {
  return request<{ data: CreatorPublic }>(
    `/api/creators/${encodeURIComponent(handle)}`,
    { method: "GET" },
    opts,
  );
}

export interface SendPitchInput {
  creator_id: string;
  subject: string;
  message: string;
  proposed_budget_cents?: number;
  proposed_deliverables?: { platform: string; type: string; quantity: number }[];
  search_id?: string;
}

export async function sendPitch(
  input: SendPitchInput,
  opts: FetchOptions = {},
): Promise<{ data: Pitch }> {
  return request<{ data: Pitch }>(
    `/api/pitches`,
    { method: "POST", body: JSON.stringify(input) },
    opts,
  );
}

export async function getMyPitches(opts: FetchOptions = {}): Promise<{ data: Pitch[] }> {
  return request<{ data: Pitch[] }>(`/api/pitches`, { method: "GET" }, opts);
}

export async function getInbox(opts: FetchOptions = {}): Promise<{ data: Pitch[] }> {
  return request<{ data: Pitch[] }>(`/api/pitches/inbox`, { method: "GET" }, opts);
}
