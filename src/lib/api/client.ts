//src/lib/api/client.ts

import { supabase } from "@/lib/supabaseClient";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export type ApiRequestOptions = {
  /** If provided, sent as `Authorization: Bearer <token>` */
  token?: string;
  /** Extra headers to merge in */
  headers?: Record<string, string>;
};

async function buildHeaders(
  base?: Record<string, string>,
  opts?: ApiRequestOptions,
): Promise<Record<string, string>> {
  const headers: Record<string, string> = { ...(base ?? {}), ...(opts?.headers ?? {}) };

  // Explicit token wins.
  if (opts?.token) {
    headers.Authorization = `Bearer ${opts.token}`;
    return headers;
  }

  // Best-effort: if running in the browser, pull the current Supabase session.
  // (On the server, you should pass opts.token via cookies/SSR wiring.)
  if (typeof window !== "undefined") {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (token) headers.Authorization = `Bearer ${token}`;
    } catch {
      // ignore
    }
  }

  return headers;
}

export class ApiError extends Error {
  status: number;
  detail?: string;

  constructor(status: number, message: string, detail?: string) {
    super(message);
    this.status = status;
    this.detail = detail;
  }
}

async function parseError(res: Response): Promise<string> {
  // FastAPI commonly returns: { "detail": "..." } or { "detail": [...] }
  try {
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      // Try text fallback (sometimes proxies return HTML)
      const txt = await res.text();
      return txt?.trim()
        ? txt.trim().slice(0, 300)
        : `Request failed (${res.status})`;
    }

    const data = await res.json();

    if (typeof data?.detail === "string") return data.detail;
    if (Array.isArray(data?.detail)) {
      // FastAPI 422 payload: [{ loc: [...], msg: "...", type: "..." }, ...]
      const first = data.detail[0];
      const loc = Array.isArray(first?.loc) ? first.loc.join(".") : "request";
      const msg = first?.msg ?? "Validation error";
      return `${loc}: ${msg}`;
    }
    if (typeof data?.message === "string") return data.message;

    return `Request failed (${res.status})`;
  } catch {
    return `Request failed (${res.status})`;
  }
}

async function parseJsonOrNull<T>(res: Response): Promise<T> {
  // Avoid crashing on empty bodies (204) or non-json
  if (res.status === 204) return null as unknown as T;

  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    // If your APIs always return JSON, you can tighten this.
    return (await res.text()) as unknown as T;
  }

  return (await res.json()) as T;
}

export async function apiGet<T>(path: string, opts?: ApiRequestOptions): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    // cache: "no-store",
    // credentials: "include", // enable if you rely on cookies/sessions
    headers: await buildHeaders(undefined, opts),
  });

  if (!res.ok) {
    const detail = await parseError(res);
    throw new ApiError(res.status, detail, detail);
  }

  return await parseJsonOrNull<T>(res);
}

export async function apiPut<T>(path: string, body: unknown, opts?: ApiRequestOptions): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "PUT",
    headers: await buildHeaders({ "Content-Type": "application/json" }, opts),
    body: JSON.stringify(body),
    // credentials: "include",
  });

  if (!res.ok) {
    const detail = await parseError(res);
    throw new ApiError(res.status, detail, detail);
  }

  return await parseJsonOrNull<T>(res);
}

export async function apiPost<T>(path: string, body: unknown, opts?: ApiRequestOptions): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: await buildHeaders({ "Content-Type": "application/json" }, opts),
    body: JSON.stringify(body),
    // credentials: "include",
  });

  if (!res.ok) {
    const detail = await parseError(res);
    throw new ApiError(res.status, detail, detail);
  }

  return await parseJsonOrNull<T>(res);
}

export async function apiDelete(path: string, opts?: ApiRequestOptions): Promise<void> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "DELETE",
    // credentials: "include",
    headers: await buildHeaders(undefined, opts),
  });

  // Treat 2xx and 204 as success
  if (!res.ok) {
    const detail = await parseError(res);
    throw new ApiError(res.status, detail, detail);
  }
}

export async function apiPostForm<T>(
  path: string,
  formData: FormData,
  opts?: ApiRequestOptions,
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    body: formData,
    credentials: "include",
    headers: await buildHeaders(undefined, opts),
  });

  if (!res.ok) {
    const detail = await parseError(res);
    throw new ApiError(res.status, detail, detail);
  }

  return await parseJsonOrNull<T>(res);
}
