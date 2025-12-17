// src/app/projects/[id]/documents/[documentId]/page.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import RequireAuth from "@/components/RequireAuth";
import { getDocumentAnalysis } from "@/lib/api/documents";

type Gap = {
  id: string;
  severity: string;
  gap_reason: string;
  reg_obligation_text: string;
};

type Doc = {
  title?: string | null;
  filename?: string | null;
};

type Analysis = {
  document: Doc;
  gaps?: Gap[];
};

function DocumentAnalysisInner() {
  const params = useParams();
  const projectId = (params as any)?.id as string | undefined;
  const documentId = (params as any)?.documentId as string | undefined;

  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!documentId) return;
      try {
        setError(null);
        const a = await getDocumentAnalysis(documentId);
        if (!cancelled) setAnalysis(a as Analysis);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to load document analysis");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [documentId]);

  const gaps = analysis?.gaps ?? [];
  const totalGaps = gaps.length;
  const highGaps = useMemo(
    () => gaps.filter((g) => g.severity === "high").length,
    [gaps],
  );
  const hasGaps = gaps.length > 0;

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <header className="space-y-2">
        <p className="text-xs text-gray-500">
          Project{" "}
          {projectId ? (
            <Link href={`/projects/${projectId}`} className="text-blue-600 underline">
              {projectId}
            </Link>
          ) : (
            "—"
          )}
        </p>
        <h1 className="text-2xl font-semibold">
          Document analysis
          {analysis?.document?.title ? `: ${analysis.document.title}` : ""}
        </h1>
        {analysis?.document?.filename && (
          <p className="text-sm text-gray-600">{analysis.document.filename}</p>
        )}
      </header>

      {error && (
        <div className="rounded-md border bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!analysis && !error ? (
        <div className="p-4 text-sm text-gray-500">Loading…</div>
      ) : (
        <>
          <section className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border bg-white p-4">
              <p className="text-xs text-gray-500">TOTAL GAPS</p>
              <p className="mt-2 text-2xl font-semibold">{totalGaps}</p>
            </div>
            <div className="rounded-xl border bg-white p-4">
              <p className="text-xs text-gray-500">HIGH GAPS</p>
              <p className="mt-2 text-2xl font-semibold text-red-600">
                {highGaps}
              </p>
            </div>
          </section>

          <section className="bg-white rounded-xl border shadow-sm">
            <div className="border-b px-4 py-3">
              <h2 className="text-sm font-semibold">Gaps vs EU AI Act Title IV</h2>
            </div>

            {!hasGaps ? (
              <div className="px-4 py-6 text-sm text-gray-500">
                No gaps were stored for this document yet. Try re-running the
                analysis from the project page.
              </div>
            ) : (
              <div className="overflow-x-auto px-4 py-3">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="px-3 py-2 text-left w-1/2">Regulation obligation</th>
                      <th className="px-3 py-2 text-left">Severity</th>
                      <th className="px-3 py-2 text-left">Gap reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gaps.map((gap) => (
                      <tr key={gap.id} className="border-b last:border-b-0">
                        <td className="px-3 py-2 align-top">{gap.reg_obligation_text}</td>
                        <td className="px-3 py-2 align-top">{gap.severity}</td>
                        <td className="px-3 py-2 align-top">{gap.gap_reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}

export default function DocumentAnalysisPage() {
  return (
    <RequireAuth>
      <DocumentAnalysisInner />
    </RequireAuth>
  );
}
