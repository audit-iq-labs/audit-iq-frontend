"use client";

import { useEffect, useState } from "react";
import { getProjectActivity, ProjectActivityItem } from "@/lib/api";

interface Props {
  projectId: string;
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString();
}

function describeAction(item: ProjectActivityItem): string {
  switch (item.action) {
    case "evidence_added":
      return `Evidence added: ${item.details?.title ?? ""}`;
    case "evidence_file_uploaded":
      return `Evidence file uploaded: ${item.details?.title ?? ""}`;
    case "evidence_deleted":
      return `Evidence deleted: ${item.details?.title ?? ""}`;
    default:
      return item.action.replace(/_/g, " ");
  }
}

export default function ProjectActivityTimeline({ projectId }: Props) {
  const [items, setItems] = useState<ProjectActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const data = await getProjectActivity(projectId, 50);
        if (!cancelled) {
          setItems(data);
          setError(null);
        }
      } catch (err) {
        console.error("Failed to load activity", err);
        if (!cancelled) {
          setError("Failed to load activity");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  if (loading) {
    return (
      <div className="mt-6 text-sm text-gray-500">
        Loading recent activity…
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 text-sm text-red-500">
        {error}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mt-6 text-sm text-gray-500">
        No recent activity yet.
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold mb-2">Recent activity</h3>
      <ol className="space-y-2 border-l pl-4 border-gray-200">
        {items.map((item) => (
          <li key={item.id} className="relative">
            <span className="absolute -left-1.5 mt-1 h-3 w-3 rounded-full bg-gray-400" />
            <div className="text-xs text-gray-500">
              {formatTime(item.created_at)}
            </div>
            <div className="text-sm">
              {describeAction(item)}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
