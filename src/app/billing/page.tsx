// src/app/billing/page.tsx

"use client";

import { useEntitlements } from "@/lib/entitlements/useEntitlements";

export default function BillingPage() {
  const { data, loading, error } = useEntitlements();

  if (loading) {
    return <div className="p-8 text-sm">Loading billing details…</div>;
  }

  if (error || !data) {
    return <div className="p-8 text-sm text-red-600">Failed to load billing info.</div>;
  }

  const pkg = data.package;
  const quota = data.quota?.documents_per_month;
  const window = data.quota_window;

  return (
    <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-semibold">Plan & Billing</h1>
        <p className="text-sm text-gray-600">
          Manage your subscription and understand your usage.
        </p>
      </header>

      {/* Plan card */}
      <section className="bg-white border rounded-xl p-6">
        <h2 className="text-sm font-semibold mb-2">Current plan</h2>
        <p className="text-lg font-medium">{pkg?.plan_name ?? "Demo"}</p>
        <p className="text-sm text-gray-600">Status: {pkg?.status}</p>

        {pkg?.current_period_ends_at && (
          <p className="text-xs text-gray-500 mt-2">
            Billing cycle ends on{" "}
            {new Date(pkg.current_period_ends_at).toLocaleDateString()}
          </p>
        )}
      </section>

      {/* Usage */}
      <section className="bg-white border rounded-xl p-6">
        <h2 className="text-sm font-semibold mb-3">Usage this period</h2>

        {!quota ? (
          <p className="text-sm text-gray-500">No usage limits apply.</p>
        ) : (
          <div className="space-y-2 text-sm">
            <div>
              Documents analyzed:{" "}
              <strong>
                {quota.used} /{" "}
                {quota.limit === -1 ? "Unlimited" : quota.limit}
              </strong>
            </div>

            {window?.resets_on && (
              <div className="text-gray-600">
                Resets on{" "}
                {new Date(window.resets_on).toLocaleDateString()}
              </div>
            )}

            {!quota.allowed && (
              <div className="text-red-700 text-xs">
                You’ve reached your limit for this billing cycle.
              </div>
            )}
          </div>
        )}
      </section>

      {/* Actions */}
      <section className="flex gap-3">
        <button
          disabled
          className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white opacity-60"
        >
          Upgrade plan
        </button>

        <a
          href="mailto:sales@audit-iq.com"
          className="rounded-md border px-4 py-2 text-sm"
        >
          Contact sales
        </a>
      </section>
    </main>
  );
}
