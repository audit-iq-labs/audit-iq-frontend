import { apiGet, apiPost } from "./client";
import type {
  CreateProjectInput,
  Project,
  ProjectActivityItem,
  ProjectChecklistItem,
  ProjectChecklistSummary,
  ChecklistWithEvidence,
  ProjectListItem,
  ProjectSummary,
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

