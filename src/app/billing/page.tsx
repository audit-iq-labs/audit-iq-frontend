"use client";

import { useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import AppNav from "@/components/AppNav";
import { useEntitlements } from "@/lib/entitlements/useEntitlements";
import { createCheckoutSession } from "@/lib/api/billing";

type PlanId = "starter" | "consultant";

function BillingInner() {
  const { data, loading, error } = useEntitlements();

  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [profile, setProfile] = useState({
    contact_name: "",
    company_name: "",
    country: "",
    team_size: "",
    use_case: "",
  });

  if (loading) return <div className="p-8 text-sm">Loading billing details…</div>;
  if (error || !data)
    return <div className="p-8 text-sm text-red-600">Failed to load billing info.</div>;

  const pkg = data.package;
  const quota = data.quota?.documents_per_month;
  const quotaWindow = data.quota_window;
  const orgId = data.organization_id;

  const currentPlan = pkg?.plan_id ?? "demo";

  const showStarter = currentPlan === "demo";
  const showConsultant = currentPlan === "demo" || currentPlan === "starter";

  async function proceedToCheckout() {
    if (!selectedPlan || !orgId) return;

    try {
      setSubmitting(true);

      // 🔜 Next step: POST profile to /billing/profile

      const { checkout_url } = await createCheckoutSession(orgId, selectedPlan);
      globalThis.location.href = checkout_url;
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <AppNav />

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <header>
          <h1 className="text-2xl font-semibold">Plan & Billing</h1>
          <p className="text-sm text-gray-600">
            Manage your subscription and understand your usage.
          </p>
        </header>

        {/* Current plan */}
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
                  {quota.used} / {quota.limit === -1 ? "Unlimited" : quota.limit}
                </strong>
              </div>

              {quotaWindow?.resets_on && (
                <div className="text-gray-600">
                  Resets on{" "}
                  {new Date(quotaWindow.resets_on).toLocaleDateString()}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Upgrade / Plan options */}
        {(showStarter || showConsultant) && (
          <section className="bg-white border rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-semibold">
              {currentPlan === "starter" ? "Upgrade your plan" : "Choose a plan"}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {showStarter && (
                <button
                  className="text-left border rounded-lg p-4 hover:bg-gray-50"
                  onClick={() => {
                    setSelectedPlan("starter");
                    setShowModal(true);
                  }}
                >
                  <div className="font-medium">Starter</div>
                  <div className="text-xs text-gray-600 mt-1">
                    For individual companies & early teams
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    AUD $149 / month
                  </div>
                </button>
              )}

              {showConsultant && (
                <button
                  className="text-left border rounded-lg p-4 hover:bg-gray-50"
                  onClick={() => {
                    setSelectedPlan("consultant");
                    setShowModal(true);
                  }}
                >
                  <div className="font-medium">Consultant</div>
                  <div className="text-xs text-gray-600 mt-1">
                    For consultants managing multiple clients
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    AUD $399 / month
                  </div>
                </button>
              )}
            </div>

            <a
              href="mailto:sales@audit-iq.com"
              className="inline-block text-sm text-blue-600 underline"
            >
              Looking for Enterprise? Contact sales
            </a>
          </section>
        )}
      </main>

      {/* Pre-checkout modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold">
              Tell us a bit about yourself
            </h3>

            <div className="space-y-3 text-sm">
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Your full name"
                value={profile.contact_name}
                onChange={(e) =>
                  setProfile({ ...profile, contact_name: e.target.value })
                }
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Company / Firm name"
                value={profile.company_name}
                onChange={(e) =>
                  setProfile({ ...profile, company_name: e.target.value })
                }
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Country"
                value={profile.country}
                onChange={(e) =>
                  setProfile({ ...profile, country: e.target.value })
                }
              />
              <select
                className="w-full border rounded px-3 py-2"
                value={profile.team_size}
                onChange={(e) =>
                  setProfile({ ...profile, team_size: e.target.value })
                }
              >
                <option value="">Team size</option>
                <option value="1">Just me</option>
                <option value="2-5">2–5</option>
                <option value="6-10">6–10</option>
                <option value="10+">10+</option>
              </select>
              <select
                className="w-full border rounded px-3 py-2"
                value={profile.use_case}
                onChange={(e) =>
                  setProfile({ ...profile, use_case: e.target.value })
                }
              >
                <option value="">Primary use case</option>
                <option value="internal">My own organisation</option>
                <option value="consulting">Client consulting</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                className="text-sm px-3 py-2"
                onClick={() => setShowModal(false)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white text-sm px-4 py-2 rounded"
                onClick={proceedToCheckout}
                disabled={submitting}
              >
                {submitting ? "Redirecting…" : "Continue to payment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function BillingPage() {
  return (
    <RequireAuth>
      <BillingInner />
    </RequireAuth>
  );
}
