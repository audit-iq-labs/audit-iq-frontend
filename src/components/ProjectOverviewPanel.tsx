// src/components/ProjectOverviewPanel.tsx

import React from "react";
import type { ProjectQualityDetail } from "@/lib/api";

// We deliberately type `summary` as `any` so we don't depend on
// the exact shape your existing getProjectSummary already returns.
// It keeps this panel additive and avoids touching existing types.
interface Props {
  projectId: string;
  summary: any;
  quality: ProjectQualityDetail;
}

function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

export default function ProjectOverviewPanel({
  projectId,
  summary,
  quality,
}: Props) {
  const project = summary?.project ?? {};
  const checklist = summary?.checklist ?? {};
  const deadlines = summary?.deadlines ?? {};
  const q = quality.summary;

  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {project.name ?? "Project"}
          </h1>
          {project.ai_use_case && (
            <p className="text-sm text-gray-600">
              Use case: {project.ai_use_case}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            ID: <span className="font-mono">{projectId}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {project.risk_category && (
            <span className="rounded-full bg-red-50 px-3 py-1 font-medium text-red-700">
              Risk: {project.risk_category}
            </span>
          )}
          {project.jurisdiction && project.jurisdiction.length > 0 && (
            <span className="rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-700">
              Jurisdiction: {project.jurisdiction.join(", ")}
            </span>
          )}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid gap-3 md:grid-cols-4">
        <KpiCard
          label="Checklist completion"
          value={formatPercent(checklist.completion_percent ?? 0)}
          helper={`${checklist.total_items ?? 0} obligations`}
        />
        <KpiCard
          label="Evidence coverage"
          value={formatPercent(q.evidence_coverage_percent ?? 0)}
          helper={`${summary.evidence?.total_evidence_items ?? 0} evidence items`}
        />
        <KpiCard
          label="Overdue obligations"
          value={(q.overdue_count ?? 0).toString()}
          helper={
            deadlines.next_due_date
              ? `Next due: ${deadlines.next_due_date}`
              : "No upcoming due dates"
          }
        />
        <KpiCard
          label="Overall risk score"
          value={(q.overall_risk_score ?? 0).toString()}
          helper={`${q.high_risk_gaps ?? 0} high-risk gaps`}
        />
      </div>
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
