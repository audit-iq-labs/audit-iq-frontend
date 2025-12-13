export type EvidenceFileType = "pdf" | "docx" | "xlsx" | "url" | "other";
export type UUID = string;

export type ProjectObligationStatus =
  | "todo"
  | "in_progress"
  | "done"
  | "not_applicable";

/* ---------------- Project core ---------------- */

export interface Project {
  id: UUID;
  name: string;
  risk_category?: string | null;
  regulation?: string | null;
  jurisdiction?: string[] | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectListItem {
  id: UUID;
  name: string;
  created_at: string;
  risk_category: string | null;
}

export interface CreateProjectInput {
  name: string;
  jurisdiction?: string[] | null;
  regulation?: string | null;
  risk_category?: string | null;
  organization_id?: string;
}

/* ---------------- Activity ---------------- */

export interface ProjectActivityItem {
  id: UUID;
  project_id: UUID;
  obligation_id: UUID | null;
  evidence_id: UUID | null;
  actor: string | null;
  action: string;
  details: Record<string, unknown> | null;
  created_at: string;
}

/* ---------------- Checklist ---------------- */

export interface ProjectChecklistSummary {
  project_id: UUID;
  total_items: number;
  by_status: Record<ProjectObligationStatus, number>;
  completion_percent: number;
}

export interface ProjectChecklistItem {
  id: UUID;
  obligation_id: UUID;
  obligation_type: string | null;
  summary: string;
  short_label: string | null;
  justification: string | null;
  status: ProjectObligationStatus;
  reference: string | null;
  due_date: string | null;
  evidence_count: number;
}

export interface EvidenceLite {
  id: string;
  title: string;
  storage_url: string | null;
  file_type: string | null;

  // optional extras if some endpoints return them
  source?: string;
  file_url?: string | null;
  created_at?: string;
}

export interface ChecklistWithEvidence {
  obligation_id: UUID;
  reference: string | null;
  short_label: string | null;
  status: ProjectObligationStatus;
  due_date: string | null;
  justification: string | null;
  evidence_count: number;
  evidence: EvidenceLite[];
}

/* ---------------- Project summary ---------------- */

export interface ProjectSummary {
  project: {
    id: UUID;
    name: string;
    risk_category?: string | null;
    ai_use_case?: string | null;
    jurisdiction?: string[] | null;
  };
  checklist: ProjectChecklistSummary;
  evidence?: {
    project_id: UUID;
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
}

export interface EvidenceItem {
  id: string;
  project_id: string;
  obligation_id: string | null;
  title: string;
  description: string | null;
  storage_url: string | null;
  file_type: EvidenceFileType | null;
  uploaded_at: string; // ISO timestamp

  // optional if some endpoints return extras
  source?: string;
  file_url?: string | null;
  created_at?: string;
  project_obligation_id?: string | null;
}