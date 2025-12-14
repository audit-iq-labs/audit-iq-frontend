// src/lib/env.ts
function num(name: string, fallback: number) {
  const raw = process.env[name];
  const n = raw ? Number(raw) : NaN;
  return Number.isFinite(n) ? n : fallback;
}

function str(name: string, fallback: string) {
  return process.env[name] ?? fallback;
}

function csv(name: string, fallback: string[]) {
  const raw = process.env[name];
  if (!raw) return fallback;
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export const ENV = {
  API_BASE_URL: str("NEXT_PUBLIC_API_BASE_URL", "http://localhost:8000"),

  MAX_ANALYZE_BYTES: num("NEXT_PUBLIC_MAX_ANALYZE_BYTES", 10 * 1024 * 1024),
  MAX_EVIDENCE_BYTES: num("NEXT_PUBLIC_MAX_EVIDENCE_BYTES", 25 * 1024 * 1024),

  // Optional: if you want these driven by env instead of hardcoding
  EVIDENCE_ALLOWED_EXT: csv("NEXT_PUBLIC_EVIDENCE_ALLOWED_EXT", [
    "pdf", "png", "jpg", "jpeg", "docx", "xlsx",
  ]),
};
