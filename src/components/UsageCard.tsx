"use client";

import { useEntitlements } from "@/lib/entitlements/useEntitlements";

function fmt(d?: string | null) {
  return d ? new Date(d).toLocaleDateString() : "—";
}

export default function UsageCard() {
  const { data, loading } = useEntitlements();

  const pkg = data?.package;
  const q = data?.quota?.documents_per_month;
  const w = data?.quota_window;

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-4 text-sm text-gray-500">
        Loading usage…
      </div>
    );
  }

  if (!q) return null;

  const unlimited = q.limit === -1;
  const percent =
    q.limit && q.limit > 0 ? Math.min(100, Math.round((q.used / q.limit) * 100)) : 0;

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium">Plan & Usage</p>
          <p className="text-xs text-gray-600">
            {pkg?.plan_name ?? "Demo"} • {pkg?.status ?? "active"}
          </p>
        </div>

        {!q.allowed && (
          <span className="rounded-full bg-red-50 px-2 py-1 text-xs text-red-700">
            Limit reached
          </span>
        )}
      </div>

      <div className="mt-3 text-sm">
        {unlimited ? (
          <p>Documents: <strong>Unlimited</strong></p>
        ) : (
          <>
            <p>
              Documents: <strong>{q.used} / {q.limit}</strong>
            </p>
            <div className="mt-2 h-2 rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-gray-900"
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-gray-600">
              Resets on {fmt(w?.resets_on)}
            </p>
          </>
        )}
      </div>
      <div className="mt-3">
        <a
            href="/billing"
            className="text-xs text-blue-600 hover:underline"
        >
            Manage plan & billing →
        </a>
      </div>
    </div>
  );
}
