// src/app/projects/[id]/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";  
import {
  apiGet,
  apiPost,
  ProjectChecklistSummary,
  ProjectChecklistItem,
  ProjectDocumentSummary,
  importAiActTitleIV,
   getProjectDocuments,
} from "@/lib/api";
import ProjectDashboard from "@/components/ProjectDashboard";

export default function ProjectPage() {
  const params = useParams();                           // ⬅️ get route params
  const projectIdRaw = (params as any)?.id;
  const projectId =
    typeof projectIdRaw === "string"
      ? projectIdRaw
      : Array.isArray(projectIdRaw)
      ? projectIdRaw[0]
      : undefined;

  const [summary, setSummary] = React.useState<ProjectChecklistSummary | null>(
    null,
  );
  const [checklist, setChecklist] = React.useState<ProjectChecklistItem[]>([]);
  const [documents, setDocuments] = React.useState<ProjectDocumentSummary[]>(
    [],
  );
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  async function refreshData() {
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
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    if (!projectId) return;
    void refreshData();
  }, [projectId]);

  async function handleImportAiActTitleIV() {
    if (!projectId) return;
    try {
      await importAiActTitleIV(projectId);     // calls POST /projects/{id}/ai-act/title-iv/ingest
      await refreshData();                     // <-- re-fetch summary + checklist + documents
    } catch (err) {
      console.error(err);
      alert("Failed to import AI Act checklist.");
    }
  }

  if (loading && !summary) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-8 text-sm text-gray-500">
        Loading project…
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-8 text-sm text-red-600">
        {error}
      </main>
    );
  }

  if (!summary) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-8 text-sm text-gray-500">
        Project not found.
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Page header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">AI Act project checklist</h1>
          <p className="text-sm text-gray-600">
            Track EU AI Act Title IV obligations, upload evidence, and monitor
            completion.
          </p>
        </div>
        <Link
          href="/projects"
          className="text-xs text-blue-600 underline whitespace-nowrap"
        >
          ← Back to projects
        </Link>
      </header>

      {/* Checklist + evidence */}
      <ProjectDashboard
        projectId={projectId}
        summary={summary}
        checklist={checklist}
        onImportAiActTitleIV={handleImportAiActTitleIV}
      />

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

        {(!documents || documents.length === 0) ? (
          <div className="px-4 py-6 text-sm text-gray-500 text-center">
            No documents yet. Upload a policy, DPIA, or AI system overview to
            begin automated analysis.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left px-4 py-2 w-1/3">Document</th>
                  <th className="text-left px-4 py-2">Filename</th>
                  <th className="text-left px-4 py-2">Uploaded</th>
                  <th className="text-right px-4 py-2">
                    Gaps (high / total)
                  </th>
                  <th className="text-right px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr
                    key={doc.id}
                    className="border-b last:border-b-0 hover:bg-gray-50 align-top"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium">
                        {doc.title ?? "Untitled document"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-600 break-all">
                        {doc.filename}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {doc.created_at ? doc.created_at.slice(0, 10) : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {doc.high_gaps != null || doc.total_gaps != null ? (
                        <span>
                          <span className="font-semibold">
                            {doc.high_gaps ?? 0}
                          </span>{" "}
                          / {doc.total_gaps ?? 0}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500">
                          Not analyzed yet
                        </span>
                      )}
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
