// src/components/ProjectOverviewPanel.tsx

import React from "react";
import type { ProjectSummary, ProjectQualityDetail } from "@/lib/api";
import ProjectActivityTimeline from "./ProjectActivityTimeline";
import UsageCard from "@/components/UsageCard";

interface Props {
  projectId: string;
  summary?: ProjectSummary | null;
  quality?: ProjectQualityDetail | null;
}

function formatPercent(value: number | null | undefined, digits = 1): string {
  if (value == null || Number.isNaN(value)) return "–";
  return `${value.toFixed(digits)}%`;
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ProjectOverviewPanel({
  projectId,
  summary,
  quality,
}: Props) {
  const project = summary?.project;
  const checklist = summary?.checklist;
  const deadlines = summary?.deadlines;
  const q = quality?.summary;

  const hasAnalytics = !!(checklist && q);

  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        {/* Left: Project info */}
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Project: {project?.name ?? "Untitled project"}
          </h1>

          {project?.ai_use_case && (
            <p className="text-sm text-gray-600">
              Use case: {project.ai_use_case}
            </p>
          )}

          <p className="mt-1 text-xs text-gray-500">
            ID: <span className="font-mono">{projectId}</span>
          </p>
        </div>

        {/* Middle: Risk / Jurisdiction pills */}
        <div className="flex flex-wrap gap-2 text-xs md:max-w-md">
          {project?.risk_category && (
            <span className="rounded-full bg-red-50 px-3 py-1 font-medium text-red-700">
              Risk: {project.risk_category}
            </span>
          )}

          {project?.jurisdiction && project.jurisdiction.length > 0 && (
            <span className="rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-700">
              Jurisdiction: {project.jurisdiction.join(", ")}
            </span>
          )}
        </div>

        {/* Right: Usage / Plan awareness */}
        <div className="md:w-80 shrink-0">
          <UsageCard />
        </div>
      </div>

      {/* KPI cards */}
      {hasAnalytics ? (
        <div className="grid gap-3 md:grid-cols-4">
          <KpiCard
            label="Checklist completion"
            value={formatPercent(checklist?.completion_percent ?? 0)}
            helper={`${checklist?.total_items ?? 0} obligations`}
          />

          <KpiCard
            label="Evidence coverage"
            value={formatPercent(q?.evidence_coverage_percent ?? 0)}
            helper={`${
              summary?.evidence?.total_evidence_items ?? 0
            } evidence items`}
          />

          <KpiCard
            label="Overdue obligations"
            value={(q?.overdue_count ?? 0).toString()}
            helper={
              deadlines?.next_due_date
                ? `Next due: ${formatDate(deadlines.next_due_date)}`
                : "No upcoming due dates"
            }
          />

          <KpiCard
            label="Overall risk score"
            value={(q?.overall_risk_score ?? 0).toString()}
            helper={`${q?.high_risk_gaps ?? 0} high-risk gaps`}
          />
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
          We don’t have analytics for this project yet. Once you upload
          evidence and update the checklist, completion, risk, and deadlines
          will appear here.
        </div>
      )}

      <ProjectActivityTimeline projectId={projectId} />
    </div>
  );
}

type KpiProps = {
  label: string;
  value: string;
  helper?: string;
};

function KpiCard({ label, value, helper }: KpiProps) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-1 text-xl font-semibold text-gray-900">{value}</p>
      {helper && (
        <p className="mt-1 text-xs text-gray-600">
          {helper}
        </p>
      )}
    </div>
  );
}
