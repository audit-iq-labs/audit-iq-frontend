"use client";

import Link from "next/link";
import type { ProjectDocumentSummary } from "@/lib/api";

interface ProjectDocumentsTableProps {
  projectId: string;
  documents: ProjectDocumentSummary[];
}

export default function ProjectDocumentsTable({
  projectId,
  documents,
}: ProjectDocumentsTableProps) {
  if (!documents || documents.length === 0) {
    return (
      <div className="px-4 py-6 text-sm text-gray-500 text-center">
        No documents yet. Upload a policy, DPIA, or AI system overview to
        begin automated analysis.
      </div>
    );
  }

  return (
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
  );
}
