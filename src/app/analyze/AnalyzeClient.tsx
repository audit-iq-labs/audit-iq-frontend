// src/app/analyze/AnalyzeClient.tsx

"use client";

import { FormEvent, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { apiGet } from "@/lib/apiClient";
import {
  uploadAnalysisDocument,
  analyzeDocument,
  getDocumentGapSummary,
} from "@/lib/api/documents";

import {
  UPLOAD_RULES,
  buildAcceptAttr,
  validateFile,
  isPdf,
  formatBytes,
} from "@/lib/uploadRules";

function friendlyMessage(err: unknown): string {
  // Network / fetch failure
  if (err instanceof TypeError) {
    return "Cannot reach the server. Please try again in sometime";
  }

  // Our typed API errors
  if (err instanceof ApiError) {
    const { status, detail } = err;

    if (status === 413) {
    return `This PDF is too large. Max allowed is ${formatBytes(UPLOAD_RULES.analyze.maxBytes)}.`;
    }

    if (status === 400) {
      return detail || "Invalid PDF. Please upload a valid document.";
    }

    if (status === 404) {
      return detail || "Requested resource not found.";
    }

    if (status >= 500) {
      return "Server error during analysis. Please retry in a moment.";
    }

    if (status === 402) {
      return detail || "You’ve reached your monthly analysis limit. Please upgrade or wait for the reset.";
    }

    return detail || "Request failed. Please retry.";
  }

  return "Something went wrong. Please retry.";
}

type GapRow = {
  id: string;
  regulation_obligation: string;
  severity: string;
  gap_reason: string;
};

type ExtractedObligation = {
  id: string;
  summary: string;
  type: string;
  ai_act_reference: string | null;
};

type AnalysisResult = {
  document_id: string;
  total_gaps: number;
  high_gaps: number;
  extracted_obligations: ExtractedObligation[];
  gaps: GapRow[];
};

export default function AnalyzeClient() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const [quotaNote, setQuotaNote] = useState<string | null>(null);
  const [quotaAllowed, setQuotaAllowed] = useState<boolean>(true);

  async function loadEntitlements() {
    try {
      const ent = await apiGet("/me/entitlements");
      const q = ent?.quota?.documents_per_month;
      const resetsOn = ent?.quota_window?.resets_on;

      if (!q) return;

      if (q.allowed === false) {
        setQuotaAllowed(false);
        setQuotaNote(
          `Limit reached. Resets on ${resetsOn ? new Date(resetsOn).toLocaleDateString() : "—"}.`
        );
      } else {
        setQuotaAllowed(true);
        const remaining =
          q.limit === -1 ? "Unlimited" : q.remaining ?? (q.limit === null ? null : "—");
        setQuotaNote(
          q.limit === -1
            ? "Unlimited analyses."
            : `${remaining} analyses left • Resets on ${
                resetsOn ? new Date(resetsOn).toLocaleDateString() : "—"
              }.`
        );
      }
    } catch {
      // If entitlement fetch fails, don't block core flow
      setQuotaAllowed(true);
      setQuotaNote(null); // or "Usage info unavailable"
    }
  }

  useEffect(() => {
    loadEntitlements();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!selectedFile) {
      setError("Please choose a PDF file to analyze.");
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setError("Only PDF files are supported right now.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // 1) Upload the document (optionally linked to a project later)
      const uploaded = await uploadAnalysisDocument(selectedFile);

      // 2) Run analysis for that document
      const analysis = await analyzeDocument(uploaded.id);

      // 3) Fetch gap summary (totals) for that document
      const summary = await getDocumentGapSummary(uploaded.id);

      // 4) Normalise into the shape our UI expects
      const normalised: AnalysisResult = {
        document_id: summary.document_id,
        total_gaps: summary.total_gaps ?? 0,
        high_gaps: summary.high_gaps ?? 0,
        extracted_obligations: (analysis.extracted_obligations ?? []).map((ob: unknown) => {
          const rec = ob as Record<string, unknown>;
          return {
            id: String(rec.id ?? ""),
            summary: String(rec.obligation_text ?? rec.summary ?? ""),
            type: String(rec.obligation_type ?? rec.type ?? "unknown"),
            ai_act_reference: (rec.ai_act_reference ?? null) as string | null,
          };
        }),
        gaps: (analysis.gaps ?? []).map((g: unknown) => {
          const rec = g as Record<string, unknown>;
          return {
            id: String(rec.id ?? ""),
            regulation_obligation: String(rec.reg_obligation_text ?? ""),
            severity: String(rec.severity ?? "high"),
            gap_reason: String(rec.gap_reason ?? ""),
          };
        }),
      };

      setResult(normalised);
      await loadEntitlements();
    } catch (err: unknown) {
      console.error(err);
      setError(friendlyMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Single Document Compliance Check</h1>
        <p className="text-sm text-gray-600">
          Upload an internal policy, DPIA or procedure and see how it compares against EU AI Act Title
          IV obligations.
        </p>
        {projectId && (
          <p className="text-xs text-gray-500">
            Running this check for project <span className="font-mono">{projectId}</span>. In a later
            version this analysis can be attached directly to the project.
          </p>
        )}
      </header>

      <section className="bg-white rounded-xl shadow-sm border p-4 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block text-sm font-medium">
            <span>Choose file</span>
            <input
            type="file"
            accept={buildAcceptAttr(UPLOAD_RULES.analyze.allowedExt)} // ".pdf"
            onChange={(e) => {
                const f = e.target.files?.[0] ?? null;

                setSelectedFile(null);
                setError(null);

                if (!f) return;

                // strict PDF check (extension or mime)
                if (!isPdf(f)) {
                setError("Only PDF files are supported for analysis.");
                e.currentTarget.value = "";
                return;
                }

                const msg = validateFile(f, UPLOAD_RULES.analyze);
                if (msg) {
                setError(`${msg} Please upload a smaller PDF.`);
                e.currentTarget.value = "";
                return;
                }

                setSelectedFile(f);
            }}
            />
          </label>

            {error && (
            <div className="rounded border p-3 text-sm">
                <div className="text-red-600">{error}</div>
                <button
                className="mt-2 text-blue-600 underline"
                onClick={() => {
                    setError(null);
                    // optionally re-run last action if you store last payload
                }}
                type="button"
                >
                Retry
                </button>
            </div>
            )}

          <button
            type="submit"
            disabled={isSubmitting || !selectedFile || !quotaAllowed}
            className="w-full inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:bg-gray-300"
          >
            {isSubmitting ? "Analyzing…" : "Upload & analyze"}
          </button>
          {quotaNote && (
            <p className={`text-xs ${quotaAllowed ? "text-gray-600" : "text-red-700"}`}>
              {quotaNote}
            </p>
          )}
        </form>
      </section>

      {result && (
        <section className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow-sm border p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wide">Total gaps</div>
              <div className="mt-1 text-2xl font-semibold">{result.total_gaps}</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wide">High gaps</div>
              <div className="mt-1 text-2xl font-semibold">{result.high_gaps}</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border">
            <div className="border-b px-4 py-3">
              <h2 className="text-sm font-semibold">Obligations found in your document</h2>
            </div>
            <div className="px-4 py-3">
              {result.extracted_obligations.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No obligations were confidently extracted from this document by the AI engine.
                </p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left px-2 py-2">Obligation</th>
                      <th className="text-left px-2 py-2 w-24">Type</th>
                      <th className="text-left px-2 py-2 w-32">AI Act ref.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.extracted_obligations.map((ob) => (
                      <tr key={ob.id} className="border-b last:border-b-0">
                        <td className="px-2 py-2">{ob.summary}</td>
                        <td className="px-2 py-2">{ob.type}</td>
                        <td className="px-2 py-2">{ob.ai_act_reference ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border">
            <div className="border-b px-4 py-3">
              <h2 className="text-sm font-semibold">Gaps vs EU AI Act Title IV</h2>
            </div>
            <div className="px-4 py-3 overflow-x-auto">
              {result.gaps.length === 0 ? (
                <p className="text-sm text-gray-500">No gaps identified for the extracted obligations.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left px-2 py-2 w-2/5">Regulation obligation</th>
                      <th className="text-left px-2 py-2 w-16">Severity</th>
                      <th className="text-left px-2 py-2">Gap reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.gaps.map((gap) => (
                      <tr key={gap.id} className="border-b last:border-b-0 align-top">
                        <td className="px-2 py-2">{gap.regulation_obligation}</td>
                        <td className="px-2 py-2 capitalize">{gap.severity}</td>
                        <td className="px-2 py-2 whitespace-pre-wrap">{gap.gap_reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
