import type { ProjectObligationStatus, EvidenceFileType, EvidenceLite } from "./types";

export interface ProjectChecklistItem {
  id: string;
  obligation_id: string;
  status: ProjectObligationStatus;
  due_date: string | null;
  justification: string | null;
  evidence_count: number;
  updated_at: string;

  // existing fields (if backend returns them)
  obligation_title?: string;
  obligation_summary?: string | null;
  obligation_type?: string | null;
  ai_act_reference?: string | null;

  // fields your UI references
  short_label?: string;
  reference?: string;
  summary?: string | null;
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
