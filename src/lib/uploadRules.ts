// src/lib/uploadRules.ts
import { ENV } from "@/lib/env";

export type UploadRule = {
  allowedExt: string[]; // without dot
  maxBytes: number;
};

export const UPLOAD_RULES: Record<"analyze" | "evidence", UploadRule> = {
  analyze: { allowedExt: ["pdf"], maxBytes: ENV.MAX_ANALYZE_BYTES },
  evidence: { allowedExt: ENV.EVIDENCE_ALLOWED_EXT, maxBytes: ENV.MAX_EVIDENCE_BYTES },
};

export function buildAcceptAttr(ext: string[]) {
  // ".pdf,.png,.jpg" format
  return ext.map((e) => (e.startsWith(".") ? e : `.${e}`)).join(",");
}

export function formatBytes(bytes: number) {
  const units = ["B", "KB", "MB", "GB"];
  let b = bytes;
  let i = 0;
  while (b >= 1024 && i < units.length - 1) {
    b /= 1024;
    i++;
  }
  return `${b.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export function isPdf(f: File) {
  const nameOk = f.name.toLowerCase().endsWith(".pdf");
  const mimeOk = f.type === "application/pdf";
  return nameOk || mimeOk;
}

export function validateFile(file: File, rule: UploadRule): string | null {
  const ext = file.name.toLowerCase().split(".").pop() ?? "";
  if (!rule.allowedExt.includes(ext)) {
    return `Unsupported file type ".${ext}". Allowed: ${rule.allowedExt.join(", ")}.`;
  }
  if (file.size > rule.maxBytes) {
    return `File too large. Max allowed is ${formatBytes(rule.maxBytes)}.`;
  }
  return null;
}
