// src/lib/api/document.ts

import { supabase } from "@/lib/supabaseClient";
import { API_BASE_URL, ApiError } from "./client";
import type { UUID } from "./types";
import { apiGet as authedGet, apiPost as authedPost } from "@/lib/apiClient";

/* ---------------- Types ---------------- */

export type ProjectDocumentSummary = {
  id: UUID;
  title: string;
  filename: string;
  created_at: string;
  analyzed_at: string | null;
  total_gaps: number;
  high_gaps: number;
};

export type ExtractedObligation = {
  id: UUID;
  summary: string;
  type: string;
  ai_act_reference: string | null;
};

export type SingleGap = {
  id: UUID;
  reg_obligation_id: string;
  severity: string;
  gap_reason: string;
  reg_obligation_text: string;
};

export type DocumentGapSummary = {
  document_id: UUID;
  total_gaps: number;
  high_gaps: number;
  extracted_obligations: ExtractedObligation[];
  gaps: SingleGap[];
};


export type UploadedDocument = {
  id: UUID;
  title: string;
  filename: string;
  content_type: string;
  size_bytes: number | null;
  created_at: string;
};

export type AnalyzedDocument = {
  id: UUID;
  project_id: UUID;
  filename?: string | null;
  status?: string | null;
  created_at?: string | null;
};

export type AnalyzeResult = {
  document: AnalyzedDocument;
  extracted_obligations: {
    id: UUID;
    obligation_text: string;
    obligation_type?: string | null;
    ai_act_reference?: string | null;
  }[];
  gaps: {
    id: UUID;
    reg_obligation_id: string;
    severity: string;
    gap_reason: string;
    reg_obligation_text: string;
  }[];
};

/* ---------------- API calls ---------------- */

export type GapSummaryOut = {
  document_id: UUID;
  total_gaps: number;
  by_severity: Record<string, number>;
};

export type DocumentAnalysisOut = {
  document: UploadedDocument;
  extracted_obligations: {
    id: UUID;
    obligation_text: string;
    obligation_type: string | null;
    ai_act_reference: string | null;
  }[];
  gaps: {
    id: UUID;
    reg_obligation_id: UUID;
    severity: string;
    gap_reason: string;
    reg_obligation_text: string;
  }[];
};

export function getDocumentAnalysis(documentId: string): Promise<DocumentAnalysisOut> {
  return authedGet(`/api/documents/${documentId}/analysis`);
}

/* ---------- API ---------- */

export async function uploadAnalysisDocument(file: File): Promise<UploadedDocument> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const res = await fetch(`${API_BASE_URL}/api/documents/upload`, {
    method: "POST",
    body: formData,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) {
    // reuse parseError exactly like apiGet/apiPost
    const contentType = res.headers.get("content-type") ?? "";
    let detail = `Request failed (${res.status})`;
    try {
      if (contentType.includes("application/json")) {
        const data = await res.json();
        if (typeof data?.detail === "string") detail = data.detail;
        else if (Array.isArray(data?.detail)) detail = "Request validation failed.";
      } else {
        const txt = await res.text();
        if (txt?.trim()) detail = txt.trim().slice(0, 300);
      }
    } catch {}
    throw new ApiError(res.status, detail, detail);
  }

  return (await res.json()) as UploadedDocument;
}

export function analyzeDocument(documentId: UUID): Promise<AnalyzeResult> {
  return authedPost(`/api/documents/${documentId}/analyze`, {});
}

export function getProjectDocuments(projectId: UUID) {
  return authedGet(`/api/documents/projects/${projectId}/documents`);
}

export function getDocumentGapSummary(documentId: UUID) {
  return authedGet(`/api/documents/${documentId}/gaps/summary`);
}
