// src/app/projects/[id]/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { apiGet } from "@/lib/api/client";
import type { ProjectChecklistSummary, ProjectChecklistItem } from "@/lib/api/types";
import { getProjectDocuments, type ProjectDocumentSummary } from "@/lib/api/documents";
import { importAiActTitleIV } from "@/lib/api/projects";

import ProjectDashboard from "@/components/ProjectDashboard";

export default function ProjectPage() {
  const params = useParams();
  const projectIdParam = (params as any)?.id;
  const projectId =
    typeof projectIdParam === "string"
      ? projectIdParam
      : Array.isArray(projectIdParam)
        ? projectIdParam[0]
        : undefined;

  const [summary, setSummary] = React.useState<ProjectChecklistSummary | null>(null);
  const [checklist, setChecklist] = React.useState<ProjectChecklistItem[]>([]);
  const [documents, setDocuments] = React.useState<ProjectDocumentSummary[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const refreshData = React.useCallback(async () => {
    if (!projectId) return;

    try {
      setError(null);
      setLoading(true);

      const [summaryRes, checklistRes, docsRes] = await Promise.all([
        apiGet<ProjectChecklistSummary>(`/projects/${projectId}/checklist/summary`),
        apiGet<ProjectChecklistItem[]>(`/projects/${projectId}/checklist`),
        getProjectDocuments(projectId),
      ]);

      setSummary(summaryRes);
      setChecklist(checklistRes);
      setDocuments(docsRes);
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Failed to load project");
      setSummary(null);
      setChecklist([]);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  React.useEffect(() => {
    void refreshData();
  }, [refreshData]);

  async function handleImportAiActTitleIV() {
    if (!projectId) return;
    try {
      await importAiActTitleIV(projectId);
      await refreshData();
    } catch (err) {
      console.error(err);
      alert("Failed to import AI Act checklist.");
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Header ALWAYS visible -> fixes Playwright flakiness */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">AI Act project checklist</h1>
          <p className="text-sm text-gray-600">
            Track EU AI Act Title IV obligations, upload evidence, and monitor completion.
          </p>
        </div>
        <Link href="/projects" className="text-xs text-blue-600 underline whitespace-nowrap">
          ← Back to projects
        </Link>
      </header>

      {/* Status block */}
      {!projectId && (
        <div className="text-sm text-red-600">Missing project id in route.</div>
      )}

      {error && (
        <div className="text-sm text-red-600 border border-red-200 bg-red-50 rounded-md p-3">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-sm text-gray-500">Loading project…</div>
      )}

      {/* Checklist + evidence */}
      {summary ? (
        <ProjectDashboard
          projectId={projectId!}
          summary={summary}
          checklist={checklist}
          onImportAiActTitleIV={handleImportAiActTitleIV}
        />
      ) : (
        !loading &&
        !error && <div className="text-sm text-gray-500">Project not found.</div>
      )}

      {/* Documents section */}
      <section className="border rounded-lg p-6 shadow-sm bg-white">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Analyzed documents</h2>
          {projectId && (
            <Link
              href={`/analyze?projectId=${projectId}`}
              className="text-xs text-blue-600 underline"
            >
              Run single-document analysis
            </Link>
          )}
        </div>

        {!documents?.length ? (
          <div className="px-4 py-6 text-sm text-gray-500 text-center">
            No documents yet. Upload a policy, DPIA, or AI system overview to begin automated analysis.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left px-4 py-2 w-1/3">Document</th>
                  <th className="text-left px-4 py-2">Filename</th>
                  <th className="text-left px-4 py-2">Uploaded</th>
                  <th className="text-right px-4 py-2">Gaps (high / total)</th>
                  <th className="text-right px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} className="border-b last:border-b-0 hover:bg-gray-50 align-top">
                    <td className="px-4 py-3">
                      <div className="font-medium">{doc.title ?? "Untitled document"}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-600 break-all">{doc.filename}</span>
                    </td>
                    <td className="px-4 py-3">
                      {doc.created_at ? doc.created_at.slice(0, 10) : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span>
                        <span className="font-semibold">{doc.high_gaps ?? 0}</span> /{" "}
                        {doc.total_gaps ?? 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/projects/${projectId}/documents/${doc.id}`}
                        className="text-xs text-blue-600 underline"
                      >
                        View analysis
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
