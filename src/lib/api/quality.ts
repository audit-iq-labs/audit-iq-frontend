import { apiGet } from "./client";
import type { ProjectObligationStatus } from "./types";

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
  | "unknown";

export interface ProjectGapItem {
  obligation_id: string;
  reference: string | null;
  short_label: string | null;
  status: ProjectObligationStatus;
  due_date: string | null;
  has_evidence: boolean;
  reason: ProjectGapReason;
}

export interface ProjectQualityDetail {
  summary: ProjectQualitySummary;
  gaps: ProjectGapItem[];
}

export function getProjectQuality(projectId: string): Promise<ProjectQualityDetail> {
  return apiGet<ProjectQualityDetail>(`/projects/${projectId}/quality`);
}