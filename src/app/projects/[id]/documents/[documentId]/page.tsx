// src/app/projects/[id]/documents/documentId/page.tsx
import Link from "next/link";
import { getDocumentAnalysis } from "@/lib/api/documents";

type PageProps = {
  params: {
    id: string;
    documentId: string;
  };
};

export default async function DocumentAnalysisPage({ params }: PageProps) {
  const { id: projectId, documentId } = params;

  const analysis = await getDocumentAnalysis(documentId);

  const document = analysis.document;
  const gaps = analysis.gaps ?? [];
  const totalGaps = gaps.length;
  const highGaps = gaps.filter((g) => g.severity === "high").length;
  const hasGaps = gaps.length > 0;

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <header className="space-y-2">
        <p className="text-xs text-gray-500">
          Project{" "}
          <Link
            href={`/projects/${projectId}`}
            className="text-blue-600 underline"
          >
            {projectId}
          </Link>
        </p>
        <h1 className="text-2xl font-semibold">
          Document analysis{document?.title ? `: ${document.title}` : ""}
        </h1>
        {document?.filename && (
          <p className="text-sm text-gray-600">{document.filename}</p>
        )}
      </header>

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
                  <th className="px-3 py-2 text-left w-1/2">
                    Regulation obligation
                  </th>
                  <th className="px-3 py-2 text-left">Severity</th>
                  <th className="px-3 py-2 text-left">Gap reason</th>
                </tr>
              </thead>
              <tbody>
                {gaps.map((gap) => (
                  <tr key={gap.id} className="border-b last:border-b-0">
                    <td className="px-3 py-2 align-top">
                      {gap.reg_obligation_text}
                    </td>
                    <td className="px-3 py-2 align-top">{gap.severity}</td>
                    <td className="px-3 py-2 align-top">{gap.gap_reason}</td>
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
