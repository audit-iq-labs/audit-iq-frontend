export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export type EvidenceFileType = "pdf" | "docx" | "xlsx" | "url" | "other";

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    // optional: avoid caching if you always want fresh data
    // cache: "no-store",
  });

  if (!res.ok) {
    // You can enhance this later to parse error body
    throw new Error(`API error ${res.status} on GET ${path}`);
  }

  return (await res.json()) as T;
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status} on PUT ${path}`);
  }

  return (await res.json()) as T;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status} on POST ${path}`);
  }

  return (await res.json()) as T;
}

export async function apiDelete(path: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "DELETE",
  });

  // Allow 204 (no content) as success
  if (!res.ok && res.status !== 204) {
    throw new Error(`API error ${res.status} on DELETE ${path}`);
  }
}

// ---- Project checklist / summary types ----

export type ProjectObligationStatus =
  | "todo"
  | "in_progress"
  | "done"
  | "not_applicable";

export interface ProjectChecklistSummary {
  project_id: string;
  total_items: number;
  by_status: Record<ProjectObligationStatus, number>;
  completion_percent: number;
}

export function getProjectChecklistSummary(
  projectId: string,
): Promise<ProjectChecklistSummary> {
  return apiGet<ProjectChecklistSummary>(
    `/projects/${projectId}/checklist/summary`,
  );
}

export interface ProjectChecklistItem {
  id: string;
  obligation_id: string;
  obligation_type: string | null;
  summary: string;
  short_label: string | null;
  justification: string | null;
  status: ProjectObligationStatus;
  reference: string | null;
  due_date: string | null; // ISO date string or null
  evidence_count: number;
}

export interface EvidenceLite {
  id: string;
  title: string;
  storage_url: string | null;
  file_type: string | null;
}

export interface ChecklistWithEvidence {
  obligation_id: string;
  reference: string | null;
  short_label: string | null;
  status: ProjectObligationStatus;
  due_date: string | null;
  justification: string | null;
  evidence_count: number;
  evidence: EvidenceLite[];
}

// ---- Project-specific API helpers ----

export interface ProjectSummary {
  project: {
    id: string;
    name: string;
    risk_category?: string | null;
    ai_use_case?: string | null;
    jurisdiction?: string[] | null;
  };
  checklist: ProjectChecklistSummary;
  evidence?: {
    project_id: string;
    total_evidence_items: number;
    obligations_with_evidence: number;
    obligations_without_evidence: number;
    avg_evidence_per_obligation: number;
    missing_evidence_for_done: number;
    evidence_coverage_percent: number;
  };
  deadlines?: {
    next_due_date: string | null;
    overdue_count: number;
  };
  // quality summary is already available via getProjectQuality,
  // but you can mirror it here later if needed.
}

export function getProjectSummary(
  projectId: string,
): Promise<ProjectSummary> {
  return apiGet<ProjectSummary>(`/projects/${projectId}/summary`);
}

export function getProjectChecklist(
  projectId: string,
): Promise<ProjectChecklistItem[]> {
  return apiGet<ProjectChecklistItem[]>(`/projects/${projectId}/checklist`);
}

export function getProjectChecklistWithEvidence(
  projectId: string,
): Promise<ChecklistWithEvidence[]> {
  return apiGet<ChecklistWithEvidence[]>(
    `/projects/${projectId}/checklist-with-evidence`,
  );
}

// src/lib/api.ts

export interface EvidenceItem {
  id: string;
  project_id: string;
  obligation_id: string | null;
  title: string;
  description: string | null;
  storage_url: string | null;
  file_type: EvidenceFileType | null;
  uploaded_at: string; // ISO timestamp
}

// ---- Project list types & helpers ----

export interface Project {
  id: string;
  name: string;
  // optional fields – adjust to match your API if needed
  regulation?: string | null;
  created_at?: string;
  updated_at?: string;
}

// ---- Project quality / gap analysis types & helpers ----

// Reuse your existing ProjectObligationStatus type from this file.
// If the name differs, adjust the import below accordingly.
export interface ProjectQualitySummary {
  project_id: string;
  completion_percent: number;
  evidence_coverage_percent: number;
  overdue_count: number;
  high_risk_gaps: number;
  overall_risk_score: number;
}

export type ProjectGapReason =
  | "overdue"
  | "missing_evidence"
  | "not_started"
  | string;

export interface ProjectGapItem {
  obligation_id: string;
  reference: string | null;
  short_label: string | null;
  status: ProjectObligationStatus; // already defined in this file
  due_date: string | null;
  has_evidence: boolean;
  reason: ProjectGapReason;
}

export interface ProjectQualityDetail {
  summary: ProjectQualitySummary;
  gaps: ProjectGapItem[];
}

/**
 * Fetch quality / gap analysis for a project.
 * Backend: GET /projects/{project_id}/quality
 */
export function getProjectQuality(
  projectId: string,
): Promise<ProjectQualityDetail> {
  return apiGet<ProjectQualityDetail>(`/projects/${projectId}/quality`);
}

export interface ProjectListItem {
  id: string;
  name: string;
  created_at: string;
  risk_category: string | null;
}

export function getProjects(): Promise<ProjectListItem[]> {
  return apiGet<ProjectListItem[]>("/projects");
}

export interface ProjectActivityItem {
  id: string;
  project_id: string;
  obligation_id: string | null;
  evidence_id: string | null;
  actor: string | null;
  action: string;
  details: Record<string, unknown> | null;
  created_at: string; // ISO
}

export function getProjectActivity(
  projectId: string,
  limit = 50,
): Promise<ProjectActivityItem[]> {
  return apiGet<ProjectActivityItem[]>(
    `/projects/${projectId}/activity?limit=${limit}`,
  );
}

export async function importAiActTitleIV(projectId: string): Promise<void> {
  await apiPost(`/projects/${projectId}/ai-act/title-iv/ingest`, {});
}

// ---- Project create types & helpers ----

export interface CreateProjectInput {
  name: string;
  jurisdiction?: string[] | null;   // was string | null
  regulation?: string | null;
  risk_category?: string | null;
  organization_id?: string;         // ready for future when you wire orgs
}

/**
 * Create a new project.
 * Backend: POST /projects
 */
export function createProject(
  payload: CreateProjectInput,
): Promise<Project> {
  return apiPost<Project>("/projects", payload);
}

  export async function uploadAnalysisDocument(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/api/documents/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to upload document");
  }

  return res.json() as Promise<{
    id: string;
    title: string;
    filename: string;
    content_type: string;
    size_bytes: number | null;
    created_at: string;
  }>;
}

export async function analyzeDocument(documentId: string) {
  const res = await fetch(
    `${API_BASE_URL}/api/documents/${documentId}/analyze`,
    {
      method: "POST",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to analyze document");
  }

  return res.json() as Promise<{
    document: any;
    extracted_obligations: {
      id: string;
      obligation_text: string;
      obligation_type?: string | null;
      ai_act_reference?: string | null;
    }[];
    gaps: {
      id: string;
      reg_obligation_id: string;
      severity: string;
      gap_reason: string;
      reg_obligation_text: string;
    }[];
  }>;
}

// --- Document analysis helpers -------------------------------------------

export type ProjectDocumentSummary = {
  id: string;
  title: string;
  filename: string;
  created_at: string;
  analyzed_at: string | null;
  total_gaps: number;
  high_gaps: number;
};

export type SingleGap = {
  id: string;
  reg_obligation_id: string;
  severity: string;
  gap_reason: string;
  reg_obligation_text: string;
};

export type DocumentGapSummary = {
  document_id: string;
  total_gaps: number;
  high_gaps?: number;
  by_severity?: Record<string, number>;
  gaps?: SingleGap[];
};

export async function getProjectDocuments(
  projectId: string
): Promise<ProjectDocumentSummary[]> {
  const res = await fetch(
    `${API_BASE_URL}/api/projects/${projectId}/documents`,
    {
      // project dashboard should always show the latest data
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to load project documents");
  }

  return res.json() as Promise<ProjectDocumentSummary[]>;
}

export async function getDocumentGapSummary(
  documentId: string
): Promise<DocumentGapSummary> {
  const res = await fetch(
    `${API_BASE_URL}/api/documents/${documentId}/gaps/summary`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to load gap summary");
  }

  return res.json() as Promise<DocumentGapSummary>;
}

// Convenience helpers for document detail page -----------------------------

export async function getDocument(documentId: string) {
  const res = await fetch(`${API_BASE_URL}/api/documents/${documentId}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to load document");
  }

  // Keep this flexible until the backend shape is fully stabilised.
  return res.json() as Promise<any>;
}

export async function getDocumentAnalysis(
  documentId: string
): Promise<DocumentGapSummary> {
  // For now this is just an alias to the summary endpoint
  return getDocumentGapSummary(documentId);
}

