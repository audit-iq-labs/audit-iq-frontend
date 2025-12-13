import { apiGet, apiPost } from "./client";
import type {
  Project,
  ProjectListItem,
  ProjectSummary,
  ProjectActivityItem,
  CreateProjectInput,
  ProjectChecklistItem,
  ProjectChecklistSummary,
  ChecklistWithEvidence,
} from "./types";

export function getProjects(): Promise<ProjectListItem[]> {
  return apiGet<ProjectListItem[]>("/projects");
}

export function getProjectSummary(projectId: string): Promise<ProjectSummary> {
  return apiGet<ProjectSummary>(`/projects/${projectId}/summary`);
}

export function createProject(payload: CreateProjectInput): Promise<Project> {
  return apiPost<Project>("/projects", payload);
}

export async function importAiActTitleIV(projectId: string): Promise<void> {
  await apiPost(`/projects/${projectId}/ai-act/title-iv/ingest`, {});
}

export function getProjectActivity(
  projectId: string,
  limit = 50,
): Promise<ProjectActivityItem[]> {
  return apiGet<ProjectActivityItem[]>(
    `/projects/${projectId}/activity?limit=${limit}`,
  );
}

export function getProjectChecklist(
  projectId: string,
): Promise<ProjectChecklistItem[]> {
  return apiGet<ProjectChecklistItem[]>(`/projects/${projectId}/checklist`);
}

export function getProjectChecklistSummary(
  projectId: string,
): Promise<ProjectChecklistSummary> {
  return apiGet<ProjectChecklistSummary>(
    `/projects/${projectId}/checklist/summary`,
  );
}

export function getProjectChecklistWithEvidence(
  projectId: string,
): Promise<ChecklistWithEvidence[]> {
  return apiGet<ChecklistWithEvidence[]>(
    `/projects/${projectId}/checklist-with-evidence`,
  );
}
