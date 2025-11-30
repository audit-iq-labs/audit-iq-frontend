"use client";

import React from "react";
import {
  apiPut,
  apiPost,
  apiGet,
  apiDelete,
  ProjectChecklistSummary,
  ProjectChecklistItem,
  EvidenceItem,
  ProjectObligationStatus,
} from "@/lib/api";

interface Props {
  projectId: string;
  summary: ProjectChecklistSummary;
  checklist: ProjectChecklistItem[];
}

// Local alias so the code reads nicely
type ChecklistItem = ProjectChecklistItem;

const STATUS_LABELS: Record<ProjectObligationStatus, string> = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
  not_applicable: "Not applicable",
};

export default function ProjectDashboard({
  projectId,
  summary,
  checklist,
}: Props) {
  const [items, setItems] = React.useState<ChecklistItem[]>(checklist);
  const [editingJustificationId, setEditingJustificationId] =
    React.useState<string | null>(null);
  const [draftJustification, setDraftJustification] =
    React.useState<string>("");

  const [evidenceState, setEvidenceState] = React.useState<{
    open: boolean;
    loading: boolean;
    obligationId: string | null;
    shortLabel: string | null;
    items: EvidenceItem[];
    newTitle: string;
    newDescription: string;
  }>({
    open: false,
    loading: false,
    obligationId: null,
    shortLabel: null,
    items: [],
    newTitle: "",
    newDescription: "",
  });

  React.useEffect(() => {
    setItems(checklist);
  }, [checklist]);

  // ------- Status update --------
  async function handleStatusChange(
    item: ChecklistItem,
    newStatus: ProjectObligationStatus,
  ) {
    try {
      const updated = await apiPut<ChecklistItem>(
        `/projects/${projectId}/checklist/${item.id}`,
        { status: newStatus },
      );

      setItems((prev) =>
        prev.map((row) => (row.id === item.id ? { ...row, ...updated } : row)),
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  }

  // ------- Justification editing --------
  function startEditJustification(item: ChecklistItem) {
    setEditingJustificationId(item.id);
    setDraftJustification(item.justification ?? "");
  }

  function cancelEditJustification() {
    setEditingJustificationId(null);
    setDraftJustification("");
  }

  async function saveJustification(item: ChecklistItem) {
    try {
      const updated = await apiPut<ChecklistItem>(
        `/projects/${projectId}/checklist/${item.id}`,
        {
          justification: draftJustification || null,
        },
      );

      setItems((prev) =>
        prev.map((row) => (row.id === item.id ? { ...row, ...updated } : row)),
      );
      cancelEditJustification();
    } catch (err) {
      console.error(err);
      alert("Failed to update justification");
    }
  }

  // ------- Evidence modal logic --------
  async function openEvidenceModal(item: ChecklistItem) {
    setEvidenceState((prev) => ({
      ...prev,
      open: true,
      loading: true,
      obligationId: item.obligation_id,
      shortLabel: item.short_label,
      items: [],
    }));

    try {
      const data = await apiGet<EvidenceItem[]>(
        `/evidence?project_id=${projectId}&obligation_id=${item.obligation_id}`,
      );
      setEvidenceState((prev) => ({
        ...prev,
        loading: false,
        items: data,
      }));
    } catch (err) {
      console.error(err);
      setEvidenceState((prev) => ({ ...prev, loading: false }));
      alert("Failed to load evidence");
    }
  }

  function closeEvidenceModal() {
    setEvidenceState((prev) => ({
      ...prev,
      open: false,
      items: [],
      obligationId: null,
      shortLabel: null,
      newTitle: "",
      newDescription: "",
    }));
  }

  async function addEvidence() {
    if (!evidenceState.obligationId) return;          // 1️⃣ early bail-out

    if (!evidenceState.newTitle.trim()) {
      alert("Title is required");
      return;
    }

    try {
      const created = await apiPost<EvidenceItem>("/evidence", {
        project_id: projectId,
        obligation_id: evidenceState.obligationId,    // 2️⃣ payload
        title: evidenceState.newTitle,
        description: evidenceState.newDescription || null,
      });

      setEvidenceState((prev) => ({
        ...prev,
        items: [created, ...prev.items],             // 3️⃣ optimistic list update
        newTitle: "",
        newDescription: "",
      }));
      // ...
    } catch (err) {
      console.error(err);
      alert("Failed to add evidence");
    }
  }


  async function deleteEvidence(evidenceId: string) {
    if (!confirm("Delete this evidence item?")) return;

    try {
      await apiDelete(`/evidence/${evidenceId}`);

      const obligationId = evidenceState.obligationId;

      setEvidenceState((prev) => ({
        ...prev,
        items: prev.items.filter((e) => e.id !== evidenceId),
      }));

      if (obligationId) {
        setItems((prev) =>
          prev.map((row) =>
            row.obligation_id === obligationId
              ? {
                  ...row,
                  evidence_count: Math.max(
                    0,
                    (row.evidence_count ?? 0) - 1,
                  ),
                }
              : row,
          ),
        );
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete evidence");
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="border rounded-lg p-6 shadow-sm bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Compliance Summary</h2>
          <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
            {summary.completion_percent.toFixed(1)}% complete
          </span>
        </div>
        <div className="flex gap-6 text-sm">
          <div>🟦 Todo: {summary.by_status.todo}</div>
          <div>🟧 In Progress: {summary.by_status.in_progress}</div>
          <div>🟩 Done: {summary.by_status.done}</div>
          <div>⬜ Not Applicable: {summary.by_status.not_applicable}</div>
        </div>
        <div className="mt-4">
          <div className="mb-1 text-sm">
            Completion: {summary.completion_percent.toFixed(1)}%
          </div>
          <div className="w-full bg-gray-200 h-3 rounded">
            <div
              className="bg-green-500 h-3 rounded"
              style={{ width: `${summary.completion_percent}%` }}
            />
          </div>
        </div>
      </section>

      {/* Checklist */}
      <section className="border rounded-lg p-6 shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-4">Checklist</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border-b">Obligation</th>
                <th className="p-2 border-b">Status</th>
                <th className="p-2 border-b">Justification</th>
                <th className="p-2 border-b">Evidence</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b">
                  {/* Obligation cell */}
                  <td className="p-2 align-top">
                    <div className="font-medium">
                      {item.short_label ?? "Untitled obligation"}
                    </div>
                    {item.reference && (
                      <div className="text-xs text-gray-500">
                        {item.reference}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      {item.summary}
                    </div>
                  </td>

                  {/* Status cell */}
                  <td className="p-2 align-top">
                    <select
                      className="border rounded px-2 py-1 text-xs"
                      value={item.status}
                      onChange={(e) =>
                        handleStatusChange(
                          item,
                          e.target.value as ProjectObligationStatus,
                        )
                      }
                    >
                      {(
                        ["todo", "in_progress", "done", "not_applicable"] as const
                      ).map((status) => (
                        <option key={status} value={status}>
                          {STATUS_LABELS[status]}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Justification cell */}
                  <td className="p-2 align-top">
                    {editingJustificationId === item.id ? (
                      <div className="flex flex-col gap-2">
                        <textarea
                          className="border rounded p-2 text-xs w-full"
                          rows={3}
                          value={draftJustification}
                          onChange={(e) =>
                            setDraftJustification(e.target.value)
                          }
                        />
                        <div className="flex gap-2">
                          <button
                            className="px-3 py-1 rounded bg-blue-600 text-white text-xs"
                            onClick={() => saveJustification(item)}
                          >
                            Save
                          </button>
                          <button
                            className="px-3 py-1 rounded border text-xs"
                            onClick={cancelEditJustification}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <span className="text-xs">
                          {item.justification
                            ? item.justification
                            : "No justification yet"}
                        </span>
                        <button
                          className="text-xs text-blue-600 underline w-fit"
                          onClick={() => startEditJustification(item)}
                        >
                          {item.justification ? "Edit" : "Add"}
                        </button>
                      </div>
                    )}
                  </td>

                  {/* Evidence cell */}
                  <td className="p-2 align-top">
                    <button
                      className="text-xs text-blue-600 underline w-fit"
                      onClick={() => openEvidenceModal(item)}
                    >
                      Evidence ({item.evidence_count ?? 0})
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="p-4 text-center text-gray-500 text-sm"
                  >
                    No checklist items yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Evidence modal */}
      {evidenceState.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Evidence"
            className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Evidence – {evidenceState.shortLabel}
              </h3>
              <button
                className="text-sm text-gray-500"
                onClick={closeEvidenceModal}
              >
                ✕
              </button>
            </div>
            {evidenceState.loading ? (
              <div className="text-sm text-gray-500">Loading…</div>
            ) : (
              <div className="space-y-4">
                {/* Add evidence form */}
                <div className="border rounded p-3 space-y-2">
                  <div className="text-sm font-medium">Add evidence</div>
                  <input
                    className="border rounded w-full px-2 py-1 text-sm"
                    placeholder="Title (e.g. 'Risk management policy v3')"
                    value={evidenceState.newTitle}
                    onChange={(e) =>
                      setEvidenceState((prev) => ({
                        ...prev,
                        newTitle: e.target.value,
                      }))
                    }
                  />
                  <textarea
                    className="border rounded w-full px-2 py-1 text-sm"
                    rows={3}
                    placeholder="Description (optional)"
                    value={evidenceState.newDescription}
                    onChange={(e) =>
                      setEvidenceState((prev) => ({
                        ...prev,
                        newDescription: e.target.value,
                      }))
                    }
                  />
                  <button
                    className="px-3 py-1 rounded bg-blue-600 text-white text-xs"
                    onClick={addEvidence}
                  >
                    Save evidence
                  </button>
                </div>

                {/* Existing evidence list */}
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {evidenceState.items.length === 0 ? (
                    <div className="text-xs text-gray-500">
                      No evidence yet.
                    </div>
                  ) : (
                    evidenceState.items.map((ev) => (
                      <div
                        key={ev.id}
                        className="border rounded p-2 flex justify-between gap-2"
                      >
                        <div>
                          <div className="text-sm font-medium flex items-center gap-2">
                            {ev.title}
                            {ev.file_type && (
                              <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] uppercase tracking-wide text-gray-600">
                                {ev.file_type}
                              </span>
                            )}
                          </div>
                          {ev.description && (
                            <div className="text-xs text-gray-600 mt-1">
                              {ev.description}
                            </div>
                          )}
                          <div className="text-xs text-gray-400 mt-1">
                            {new Date(ev.uploaded_at).toLocaleString()}
                          </div>
                          {ev.storage_url && (
                            <a
                              href={ev.storage_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 underline mt-1 inline-block"
                            >
                              View file
                            </a>
                          )}
                        </div>
                        <button
                          className="text-xs text-red-600"
                          onClick={() => deleteEvidence(ev.id)}
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
