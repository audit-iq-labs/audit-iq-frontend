import { API_BASE_URL, apiGet, apiPost } from "./client";
import type { UUID } from "./types";

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

export type AnalyzeResult = {
  document: any;
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
  return apiGet<DocumentAnalysisOut>(`/api/documents/${documentId}/analysis`);
}

/* ---------- API ---------- */

export async function uploadAnalysisDocument(file: File): Promise<UploadedDocument> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/api/documents/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to upload document");
  return res.json();
}

export function analyzeDocument(documentId: UUID): Promise<AnalyzeResult> {
  // IMPORTANT: typed generic so caller doesn't get `unknown`
  return apiPost<AnalyzeResult>(`/api/documents/${documentId}/analyze`, {});
}

export function getProjectDocuments(projectId: UUID) {
  return apiGet<ProjectDocumentSummary[]>(
    `/api/documents/projects/${projectId}/documents`
  );
}

export function getDocumentGapSummary(documentId: UUID) {
  return apiGet<DocumentGapSummary>(
    `/api/documents/${documentId}/gaps/summary`
  );
}
