"use client";

import React, { useState } from "react";
import {
  uploadAnalysisDocument,
  analyzeDocument,
  getDocumentGapSummary,
} from "@/lib/api";

type AnalysisResult = Awaited<ReturnType<typeof analyzeDocument>>;
type GapSummary = Awaited<ReturnType<typeof getDocumentGapSummary>>;

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [summary, setSummary] = useState<GapSummary | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError("Please choose a file to analyze.");
      return;
    }

    try {
      setIsUploading(true);
      const uploaded = await uploadAnalysisDocument(file);

      setIsUploading(false);
      setIsAnalyzing(true);

      const result = await analyzeDocument(uploaded.id);
      setAnalysis(result);

      const gapSummary = await getDocumentGapSummary(uploaded.id);
      setSummary(gapSummary);
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Something went wrong.");
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="text-2xl font-semibold mb-4">
        Single Document Compliance Check
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        Upload an internal policy, DPIA or procedure and see how it compares
        against EU AI Act Title IV obligations.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mb-8 rounded-lg border border-gray-200 p-4 flex flex-col gap-4"
      >
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={(e) => {
            const f = e.target.files?.[0] ?? null;
            setFile(f);
          }}
        />

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-gray-300"
          disabled={!file || isUploading || isAnalyzing}
        >
          {isUploading
            ? "Uploading..."
            : isAnalyzing
            ? "Analyzing..."
            : "Upload & analyze"}
        </button>
      </form>

      {/* Instant value summary */}
      {summary && (
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="text-xs uppercase text-gray-500">Total gaps</div>
            <div className="mt-1 text-2xl font-semibold">
              {summary.total_gaps}
            </div>
          </div>
          {Object.entries(summary.by_severity).map(([severity, count]) => (
            <div
              key={severity}
              className="rounded-lg border border-gray-200 p-4"
            >
              <div className="text-xs uppercase text-gray-500">
                {severity} gaps
              </div>
              <div className="mt-1 text-2xl font-semibold">{count}</div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed results */}
      {analysis && (
        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-semibold mb-2">
              Obligations found in your document
            </h2>
            {analysis.extracted_obligations.length === 0 ? (
              <p className="text-sm text-gray-500">
                No obligations extracted (this is expected with the stubbed AI
                engine).
              </p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">
                        Obligation
                      </th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">
                        Type
                      </th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">
                        AI Act ref.
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysis.extracted_obligations.map((o) => (
                      <tr key={o.id} className="border-t">
                        <td className="px-3 py-2 align-top">{o.obligation_text}</td>
                        <td className="px-3 py-2 align-top">
                          {o.obligation_type ?? "-"}
                        </td>
                        <td className="px-3 py-2 align-top">
                          {o.ai_act_reference ?? "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">
              Gaps vs EU AI Act Title IV
            </h2>
            {analysis.gaps.length === 0 ? (
              <p className="text-sm text-gray-500">
                No gaps identified (for now we&apos;re marking everything as a
                gap in the stubbed backend).
              </p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">
                        Regulation obligation
                      </th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">
                        Severity
                      </th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">
                        Gap reason
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysis.gaps.map((g) => (
                      <tr key={g.id} className="border-t">
                        <td className="px-3 py-2 align-top">
                          {g.reg_obligation_text}
                        </td>
                        <td className="px-3 py-2 align-top">{g.severity}</td>
                        <td className="px-3 py-2 align-top">{g.gap_reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
