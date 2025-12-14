import type { ProjectObligationStatus, EvidenceLite } from "./types";
import { API_BASE_URL } from "./client";
import { apiGet, apiPost, apiDelete } from "./client";
import type { EvidenceItem, EvidenceFileType, UUID } from "./types";

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

export function listEvidence(projectId: UUID, projectObligationId: UUID) {
  return apiGet<EvidenceItem[]>(
    `/projects/${projectId}/checklist/${projectObligationId}/evidence`,
  );
}

export function addEvidenceUrl(
  projectId: UUID,
  projectObligationId: UUID,
  input: {
    title: string;
    url: string;
    file_type?: EvidenceFileType; // usually "url"
    notes?: string | null;
  },
) {
  return apiPost<EvidenceItem>(
    `/projects/${projectId}/checklist/${projectObligationId}/evidence`,
    {
      file_type: input.file_type ?? "url",
      title: input.title,
      url: input.url,
      notes: input.notes ?? null,
    },
  );
}

export async function deleteEvidence(projectId: UUID, evidenceId: UUID) {
  // Common pattern: DELETE /projects/{projectId}/evidence/{evidenceId}
  // If your backend uses a different route, tell me the exact path and I’ll adjust.
  await apiDelete(`/projects/${projectId}/evidence/${evidenceId}`);
}

export async function uploadEvidenceFile(
  projectId: UUID,
  projectObligationId: UUID,
  file: File,
  title: string,
): Promise<EvidenceItem> {
  const form = new FormData();
  form.append("file", file);
  form.append("title", title);

  const res = await fetch(
    `${API_BASE_URL}/projects/${projectId}/checklist/${projectObligationId}/evidence/upload`,
    { method: "POST", body: form },
  );

  if (!res.ok) {
    throw new Error(`API error ${res.status} on uploadEvidenceFile`);
  }

  return (await res.json()) as EvidenceItem;
}
