'use client';

import React from "react";

export interface Obligation {
  id: string;
  obligation_id: string;
  obligation_type: string;
  summary: string;
  short_label: string;
  justification: string | null;
}

export interface Summary {
  project_id: string;
  total_items: number;
  by_status: {
    not_applicable: number;
    todo: number;
    in_progress: number;
    done: number;
  };
  completion_percent: number;
}


// checklist row = obligation + status flag
export interface ChecklistItem extends Obligation {
  status: string; // "todo" | "in_progress" | "done" etc.
}

interface Props {
  projectId: string;
  summary: Summary;
  checklist: ChecklistItem[];
}

export default function ProjectDashboard({ projectId, summary, checklist }: Props) {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Project: {projectId}</h1>

      {/* Summary Card */}
      <div className="p-6 border rounded-xl shadow bg-white">
        <h2 className="text-xl font-semibold mb-4">Compliance Summary</h2>

        <div className="flex gap-6">
        <div>🟦 Todo: {summary.by_status.todo}</div>
        <div>🟧 In Progress: {summary.by_status.in_progress}</div>
        <div>🟩 Done: {summary.by_status.done}</div>
        </div>

        <div className="mt-4">
        <div className="mb-2">Completion: {summary.completion_percent}%</div>
        <div className="w-full bg-gray-200 h-3 rounded">
            <div
            className="bg-green-500 h-3 rounded"
            style={{ width: `${summary.completion_percent}%` }}
            />
        </div>
        </div>
      </div>

      {/* Checklist Table */}
      <div className="p-6 border rounded-xl shadow bg-white">
        <h2 className="text-xl font-semibold mb-4">Checklist</h2>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Obligation</th>
              <th className="p-2">Status</th>
              <th className="p-2">Justification</th>
            </tr>
          </thead>
          <tbody>
            {checklist.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-2">{item.short_label}</td>
                <td className="p-2">
                  <span
                    className={
                      item.status === "done"
                        ? "text-green-600"
                        : item.status === "in_progress"
                        ? "text-orange-600"
                        : "text-red-600"
                    }
                  >
                    {item.status}
                  </span>
                </td>
                <td className="p-2">{item.justification ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
