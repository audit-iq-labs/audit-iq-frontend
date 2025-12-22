// src/app/projects/[id]/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import RequireAuth from "@/components/RequireAuth";

import { apiGet, API_BASE_URL } from "@/lib/api/client";
import type { Project, ProjectChecklistSummary, ProjectChecklistItem } from "@/lib/api/types";
import { getProjectDocuments, type ProjectDocumentSummary } from "@/lib/api/documents";
import { importAiActTitleIV } from "@/lib/api/projects";
import { supabase } from "@/lib/supabaseClient";

import ProjectDashboard from "@/components/ProjectDashboard";

function buildAuditExportUrl(projectId: string) {
  return `${API_BASE_URL}/api/projects/${projectId}/export/audit-ready.pdf`;
}

export default function ProjectPage() {
  const params = useParams();
  const projectIdParam = (params as { id?: string | string[] } | null)?.id;
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
  const [project, setProject] = React.useState<Project | null>(null);
  const [exporting, setExporting] = React.useState(false);

  function getFilenameFromContentDisposition(cd: string | null): string | null {
    if (!cd) return null;

    // Examples:
    // attachment; filename="Audit-IQ_Org_Project_Audit-Readiness_2025-12-22.pdf"
    // attachment; filename=Audit-IQ_....pdf
    const match = cd.match(/filename\*=UTF-8''([^;]+)|filename="([^"]+)"|filename=([^;]+)/i);
    const raw = match?.[1] || match?.[2] || match?.[3];
    if (!raw) return null;

    try {
      return decodeURIComponent(raw.trim());
    } catch {
      return raw.trim();
    }
  }

  async function handleExportAuditPdf() {
    if (!projectId) return;

    try {
      setExporting(true);

      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      if (!token) throw new Error("Not authenticated");

      const res = await fetch(buildAuditExportUrl(projectId), {
        method: "GET",
        headers: {
          Accept: "application/pdf",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || "Failed to export audit PDF");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const cd = res.headers.get("content-disposition");
      console.log("content-disposition from fetch:", cd);
      const serverName = getFilenameFromContentDisposition(cd)?.replace(/^"+|"+$/g, "");

      const a = document.createElement("a");
      a.href = url;

      // ✅ prefer backend filename, fallback to existing behavior
      a.download = serverName ?? `audit-ready-${projectId}.pdf`;

      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Audit export failed. Check console.");
    } finally {
      setExporting(false);
    }
  }

  const refreshData = React.useCallback(async () => {
    if (!projectId) return;

    try {
      setError(null);
      setLoading(true);

      const [projectRes, summaryRes, checklistRes, docsRes] = await Promise.all([
        apiGet<Project>(`/projects/${projectId}`),
        apiGet<ProjectChecklistSummary>(`/projects/${projectId}/checklist/summary`),
        apiGet<ProjectChecklistItem[]>(`/projects/${projectId}/checklist`),
        getProjectDocuments(projectId),
      ]);

      setProject(projectRes);
      setSummary(summaryRes);
      setChecklist(checklistRes);
      setDocuments(docsRes);
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Failed to load project";
      setError(message);
      setSummary(null);
      setChecklist([]);
      setDocuments([]);
      setProject(null);
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
    <RequireAuth>
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-8">
        {/* Header ALWAYS visible -> fixes Playwright flakiness */}
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">
              {project?.name ?? (loading ? "Loading project…" : "Project")}
            </h1>
            <p className="text-sm text-gray-600">
              Track EU AI Act Title IV obligations, upload evidence, and monitor completion.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {projectId && (
              <button
                onClick={handleExportAuditPdf}
                disabled={exporting}
                className="px-3 py-1.5 text-xs border rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                {exporting ? "Exporting…" : "Export audit-ready PDF"}
              </button>
            )}

            <Link href="/projects" className="text-xs text-blue-600 underline whitespace-nowrap">
              ← Back to projects
            </Link>
          </div>
        </header>

        {!projectId && <div className="text-sm text-red-600">Missing project id in route.</div>}

        {error && (
          <div className="text-sm text-red-600 border border-red-200 bg-red-50 rounded-md p-3">
            {error}
          </div>
        )}

        {loading && <div className="text-sm text-gray-500">Loading project…</div>}

        {summary ? (
          <ProjectDashboard
            projectId={projectId!}
            summary={summary}
            checklist={checklist}
            onImportAiActTitleIV={handleImportAiActTitleIV}
          />
        ) : (
          !loading && !error && <div className="text-sm text-gray-500">Project not found.</div>
        )}

        <section className="border rounded-lg p-6 shadow-sm bg-white">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Analyzed documents</h2>
            {projectId && (
              <Link href={`/analyze?projectId=${projectId}`} className="text-xs text-blue-600 underline">
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
                      <td className="px-4 py-3">{doc.created_at ? doc.created_at.slice(0, 10) : "—"}</td>
                      <td className="px-4 py-3 text-right">
                        <span>
                          <span className="font-semibold">{doc.high_gaps ?? 0}</span> / {doc.total_gaps ?? 0}
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
    </RequireAuth>
  );
}
