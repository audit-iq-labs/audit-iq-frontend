//src/lib/api/client.ts

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

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
    if (Array.isArray(data?.detail)) return "Request validation failed.";
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

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    // cache: "no-store",
    // credentials: "include", // enable if you rely on cookies/sessions
  });

  if (!res.ok) {
    const detail = await parseError(res);
    throw new ApiError(res.status, detail, detail);
  }

  return await parseJsonOrNull<T>(res);
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    // credentials: "include",
  });

  if (!res.ok) {
    const detail = await parseError(res);
    throw new ApiError(res.status, detail, detail);
  }

  return await parseJsonOrNull<T>(res);
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    // credentials: "include",
  });

  if (!res.ok) {
    const detail = await parseError(res);
    throw new ApiError(res.status, detail, detail);
  }

  return await parseJsonOrNull<T>(res);
}

export async function apiDelete(path: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "DELETE",
    // credentials: "include",
  });

  // Treat 2xx and 204 as success
  if (!res.ok) {
    const detail = await parseError(res);
    throw new ApiError(res.status, detail, detail);
  }
}

export async function apiPostForm<T>(path: string, formData: FormData): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!res.ok) {
    const detail = await parseError(res);
    throw new ApiError(res.status, detail, detail);
  }

  return await parseJsonOrNull<T>(res);
}
