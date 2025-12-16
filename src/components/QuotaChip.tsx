"use client";

import { useEntitlements } from "@/lib/entitlements/useEntitlements";

function fmt(d?: string | null) {
  return d ? new Date(d).toLocaleDateString() : "—";
}

export default function QuotaChip() {
  const { data, loading } = useEntitlements();

  const q = data?.quota?.documents_per_month;
  const w = data?.quota_window;

  if (loading) return <span className="text-xs text-gray-500">Checking quota…</span>;
  if (!q) return null;

  if (q.limit === -1) {
    return <span className="text-xs text-gray-600">Unlimited</span>;
  }

  if (!q.allowed) {
    return (
      <span className="text-xs text-red-700">
        Limit reached • Resets on {fmt(w?.resets_on)}
      </span>
    );
  }

  return (
    <span className="text-xs text-gray-600">
      {q.remaining} left • Resets on {fmt(w?.resets_on)}
    </span>
  );
}
