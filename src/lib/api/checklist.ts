import { apiGet, apiPut } from "./client";

import type {
  ProjectChecklistItem,
  ProjectChecklistSummary,
  ChecklistWithEvidence,
} from "./types";

export function getProjectChecklistSummary(
  projectId: string,
): Promise<ProjectChecklistSummary> {
  return apiGet<ProjectChecklistSummary>(
    `/projects/${projectId}/checklist/summary`,
  );
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
    `/projects/${projectId}/checklist/with-evidence`,
  );
}

export type ChecklistItemUpdate = {
  status?: "todo" | "in_progress" | "done" | "not_applicable";
  due_date?: string | null;
  justification?: string | null;
};

export async function updateChecklistItem(
  projectId: string,
  projectObligationId: string,
  patch: ChecklistItemUpdate,
): Promise<ProjectChecklistItem> {
  // Backend route used in your logs earlier:
  // PUT /projects/{projectId}/checklist/{projectObligationId}
  return apiPut<ProjectChecklistItem>(
    `/projects/${projectId}/checklist/${projectObligationId}`,
    patch,
  );
}