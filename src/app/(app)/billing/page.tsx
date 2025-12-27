// src/app/(app)/billing/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import { useEntitlements } from "@/lib/entitlements/useEntitlements";
import { createCheckoutSession, createPortalSession } from "@/lib/api/billing";
import { apiPost } from "@/lib/apiClient";
import { supabase } from "@/lib/supabaseClient";

type PlanId = "starter" | "consultant";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function formatDate(v?: string | null) {
  if (!v) return null;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString();
}

function SkeletonLine({ w = "w-40" }: { w?: string }) {
  return <div className={cx("h-4 rounded bg-zinc-100", w)} />;
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border bg-white px-2 py-0.5 text-xs text-zinc-700">
      {children}
    </span>
  );
}

function Section({
  title,
  subtitle,
  children,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white border rounded-2xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          {subtitle ? <p className="text-sm text-zinc-600 mt-1">{subtitle}</p> : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function PlanCard({
  title,
  price,
  description,
  bullets,
  cta,
  highlight,
  disabled,
  onClick,
}: {
  title: string;
  price: string;
  description: string;
  bullets: string[];
  cta: string;
  highlight?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cx(
        "text-left border rounded-2xl p-5 transition",
        "hover:bg-zinc-50",
        disabled && "opacity-60 cursor-not-allowed hover:bg-white",
        highlight ? "border-zinc-900 ring-1 ring-zinc-900" : "border-zinc-200"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="text-base font-semibold">{title}</div>
            {highlight ? <Badge>Recommended</Badge> : null}
          </div>
          <div className="text-sm text-zinc-600 mt-1">{description}</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold">{price}</div>
          <div className="text-xs text-zinc-500">per month</div>
        </div>
      </div>

      <ul className="mt-4 space-y-2 text-sm text-zinc-700">
        {bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-zinc-900" />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5">
        <div
          className={cx(
            "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium",
            highlight ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-900",
            "w-full"
          )}
        >
          {cta}
        </div>
      </div>
    </button>
  );
}

function BillingInner() {
  const { data, loading, error, refetch } = useEntitlements();

  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [openingPortal, setOpeningPortal] = useState(false);
  const [syncing, setSyncing] = useState(false);
  

  const [profile, setProfile] = useState({
    contact_name: "",
    company_name: "",
    country_code: "",
    team_size: "",
    use_case: "",
  });

  const [profileLoaded, setProfileLoaded] = useState(false);

  // derive orgId safely
  const orgId = data?.organization_id ?? data?.organization?.id ?? null;

  const [pendingPlan, setPendingPlan] = useState<PlanId | null>(null);

  const storageKey = useMemo(() => {
    return orgId ? `audit_iq_pending_plan_${orgId}` : null;
  }, [orgId]);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");

  const pkg = data?.package;
  const currentPlan = (pkg?.plan_id ?? "demo") as string;

  const planFromQuery = useMemo<PlanId | null>(() => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    const p = params.get("plan");
    if (p === "starter" || p === "consultant") return p;
    return null;
  }, []);

  // Decide whether we should show the "Finish setup" checkout panel
  const showCheckoutPanel =
    Boolean(orgId) &&
    currentPlan === "demo" &&
    Boolean(planFromQuery || selectedPlan || pendingPlan);

  // Hydrate selected plan: query param wins, but allow user to click tiles too.
  useEffect(() => {
    if (!orgId) return;
    if (currentPlan !== "demo") return;

    if (planFromQuery && (planFromQuery === "starter" || planFromQuery === "consultant")) {
      setSelectedPlan(planFromQuery);
      setPendingPlan(planFromQuery);
      if (storageKey) localStorage.setItem(storageKey, planFromQuery);
    }
  }, [orgId, currentPlan, planFromQuery, storageKey]);

  useEffect(() => {
    if (!orgId) return;
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const canceled = params.get("canceled") === "1";
    if (!canceled) return;

    // If Stripe redirected back without plan param, restore last intent
    const fromStore = storageKey ? localStorage.getItem(storageKey) : null;
    const restored =
      fromStore === "starter" || fromStore === "consultant"
        ? (fromStore as PlanId)
        : null;

    if (restored && currentPlan === "demo") {
      setSelectedPlan(restored);
      setPendingPlan(restored);
    }
  }, [orgId, storageKey, currentPlan]);

  // Fetch billing profile (and avoid flicker with profileLoaded gate)
  useEffect(() => {
    if (!orgId) return;

    let cancelled = false;
    setProfileLoaded(false);

    (async () => {
      try {
        const { data: sess } = await supabase.auth.getSession();
        const token = sess.session?.access_token;

        const res = await fetch(`${API_BASE}/api/billing/profile?organization_id=${orgId}`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) {
          if (!cancelled) setProfileLoaded(true);
          return;
        }
        const p = await res.json();

        if (cancelled) return;

        setProfile((cur) => ({
          ...cur,
          contact_name: p.contact_name ?? cur.contact_name ?? "",
          company_name: p.company_name ?? cur.company_name ?? "",
          country_code: p.country_code ?? cur.country_code ?? "",
          team_size: p.team_size ?? cur.team_size ?? "",
          use_case: p.use_case ?? cur.use_case ?? "",
        }));
      } catch (e) {
        console.warn("billing profile fetch failed", e);
      } finally {
        if (!cancelled) setProfileLoaded(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [orgId, API_BASE]);

  // Stripe success sync (keep your logic)
  useEffect(() => {
    if (!orgId) return;

    const params = new URLSearchParams(window.location.search);
    const success = params.get("success");
    const sessionId = params.get("session_id");
    if (success !== "1" && !sessionId) return;

    setSyncing(true);

    (async () => {
      try {
        await apiPost("/api/billing/sync", { organization_id: orgId });
        await refetch();
        if (storageKey) localStorage.removeItem(storageKey);
        setPendingPlan(null);
        setSelectedPlan(null);

      } catch (e) {
        console.error(e);
      } finally {
        setSyncing(false);

        params.delete("success");
        params.delete("session_id");
        const next = window.location.pathname + (params.toString() ? `?${params}` : "");
        window.history.replaceState({}, "", next);
      }
    })();
  }, [orgId, refetch, storageKey]);

  const quota = data?.quota?.documents_per_month;
  const quotaWindow = data?.quota_window;

  // Stable display fields (prevent placeholder flash)
  const orgNameStable = useMemo(() => {
    if (!profileLoaded) return "—";
    return (
      profile.company_name ||
      data?.organization?.name ||
      "Your organisation"
    );
  }, [profileLoaded, profile.company_name, data?.organization?.name]);

  const orgCountryStable = useMemo(() => {
    if (!profileLoaded) return "—";
    return (
      profile.country_code ||
      data?.organization?.country_code ||
      "—"
    );
  }, [profileLoaded, profile.country_code, data?.organization?.country_code]);

  const contactNameStable = useMemo(() => {
    if (!profileLoaded) return "—";
    return profile.contact_name || "—";
  }, [profileLoaded, profile.contact_name]);

  const needsName = profileLoaded && !profile.contact_name.trim();
  const canProceedCheckout =
    Boolean(orgId) &&
    Boolean(selectedPlan) &&
    profileLoaded &&
    (!needsName || Boolean(profile.contact_name.trim()));

  const isBusy = syncing || submitting || openingPortal;

  async function openBillingPortal() {
    if (!orgId) return;

    try {
      setOpeningPortal(true);
      const returnUrl = `${window.location.origin}/billing`;
      const { portal_url } = await createPortalSession(orgId, returnUrl);
      window.location.href = portal_url;
    } catch (e) {
      console.error(e);
      alert("Failed to open billing portal.");
    } finally {
      setOpeningPortal(false);
    }
  }

  async function proceedToCheckout() {
    if (!selectedPlan || !orgId) return;
    if (!canProceedCheckout) return;

    try {
      setSubmitting(true);

      // Save profile best-effort (owner/admin can refine later)
      try {
        await apiPost("/api/billing/profile", {
          organization_id: orgId,
          contact_name: profile.contact_name || null,
          company_name: profile.company_name || null,
          country_code: profile.country_code || null,
          team_size: profile.team_size || null,
          use_case: profile.use_case || null,
        });
      } catch {
        // Don't block checkout
      }

      const { checkout_url } = await createCheckoutSession(orgId, selectedPlan);
      window.location.href = checkout_url;
    } catch (e) {
      console.error(e);
      alert("Failed to start checkout.");
    } finally {
      setSubmitting(false);
    }
  }

  if (syncing) {
    return <div className="p-8 text-sm">Updating your subscription…</div>;
  }

  if (loading) {
    return <div className="p-8 text-sm">Loading billing details…</div>;
  }

  if (error || !data) {
    return <div className="p-8 text-sm text-red-600">Failed to load billing info.</div>;
  }

  const planName = pkg?.plan_name ?? "Demo";
  const status = pkg?.status ?? "active";
  const endsOn = formatDate(pkg?.current_period_ends_at);

  const showStarter = currentPlan === "demo";
  const showConsultant = currentPlan === "demo" || currentPlan === "starter";

  return (
    <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Plan & Billing</h1>
        <p className="text-sm text-zinc-600">
          Manage your subscription, track usage, and update billing settings.
        </p>
      </header>

      <Section
        title="Organisation details"
        subtitle="These details are used for billing and onboarding."
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border rounded-xl p-4">
            <div className="text-xs text-zinc-500">Organisation</div>
            <div className="mt-1 text-sm font-semibold">
              {!profileLoaded ? <SkeletonLine w="w-56" /> : orgNameStable}
            </div>
          </div>

          <div className="bg-white border rounded-xl p-4">
            <div className="text-xs text-zinc-500">Country</div>
            <div className="mt-1 text-sm font-semibold">
              {!profileLoaded ? <SkeletonLine w="w-20" /> : orgCountryStable}
            </div>
          </div>

          <div className="bg-white border rounded-xl p-4">
            <div className="text-xs text-zinc-500">Contact</div>
            <div className="mt-1 text-sm font-semibold">
              {!profileLoaded ? <SkeletonLine w="w-40" /> : contactNameStable}
            </div>
          </div>
        </div>
      </Section>

      {/* Finish setup panel (only when demo + plan intent) */}
      {showCheckoutPanel && (
        <section className="border rounded-2xl bg-zinc-50 p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold">Finish setup</h2>
                <Badge>Almost done</Badge>
              </div>
              <p className="text-sm text-zinc-600 mt-1">
                Confirm your details and proceed to payment to activate your plan.
              </p>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white border rounded-xl p-4">
                  <div className="text-xs text-zinc-500">Name</div>
                  <div className="mt-1">
                    {!profileLoaded ? (
                      <SkeletonLine w="w-44" />
                    ) : needsName ? (
                      <input
                        className="w-full border rounded-md px-3 py-2 text-sm"
                        placeholder="Your full name"
                        value={profile.contact_name}
                        onChange={(e) =>
                          setProfile((p) => ({ ...p, contact_name: e.target.value }))
                        }
                        disabled={isBusy}
                      />
                    ) : (
                      <div className="text-sm font-semibold">{contactNameStable}</div>
                    )}
                  </div>
                </div>

                <div className="bg-white border rounded-xl p-4">
                  <div className="text-xs text-zinc-500">Organisation</div>
                  <div className="mt-1 text-sm font-semibold">
                    {!profileLoaded ? <SkeletonLine w="w-56" /> : orgNameStable}
                  </div>
                </div>

                <div className="bg-white border rounded-xl p-4">
                  <div className="text-xs text-zinc-500">Country</div>
                  <div className="mt-1 text-sm font-semibold">
                    {!profileLoaded ? <SkeletonLine w="w-20" /> : orgCountryStable}
                  </div>
                </div>

                <div className="bg-white border rounded-xl p-4">
                  <div className="text-xs text-zinc-500">Selected plan</div>
                  <div className="mt-1 text-sm font-semibold">
                    {selectedPlan ? (selectedPlan === "starter" ? "Starter" : "Consultant") : "—"}
                  </div>
                </div>
              </div>

              {!profileLoaded && (
                <p className="text-xs text-zinc-500 mt-3">
                  Loading your organisation details…
                </p>
              )}
            </div>

            <div className="shrink-0 w-full md:w-72">
              <div className="bg-white border rounded-2xl p-5 space-y-3">
                <div className="text-sm font-semibold">Proceed to payment</div>
                <p className="text-sm text-zinc-600">
                  You’ll be redirected to Stripe checkout.
                </p>

                <button
                  className="w-full rounded-md bg-zinc-900 text-white px-4 py-2 text-sm disabled:opacity-60"
                  onClick={proceedToCheckout}
                  disabled={!canProceedCheckout || isBusy}
                  title={!canProceedCheckout ? "Please complete required details" : undefined}
                >
                  {submitting ? "Redirecting…" : "Continue to Stripe"}
                </button>

                <button
                  type="button"
                  className="w-full rounded-md bg-zinc-100 text-zinc-900 px-4 py-2 text-sm disabled:opacity-60"
                  onClick={() => setSelectedPlan(null)}
                  disabled={isBusy}
                >
                  Change plan selection
                </button>

                <p className="text-xs text-zinc-500">
                  Tip: If you selected the wrong plan, choose again below.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Current plan */}
      <Section
        title="Current plan"
        subtitle="Your active subscription and billing status."
        right={<Badge>{status}</Badge>}
      >
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="text-lg font-semibold">{planName}</div>
            <div className="text-sm text-zinc-600 mt-1">
              {endsOn ? <>Billing cycle ends on <span className="font-medium">{endsOn}</span></> : " "}
            </div>
          </div>

          {currentPlan !== "demo" ? (
            <button
              className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-60"
              onClick={openBillingPortal}
              disabled={openingPortal}
            >
              {openingPortal ? "Opening…" : "Manage billing"}
            </button>
          ) : (
            <div className="text-sm text-zinc-600">
              You’re currently on <span className="font-medium">Demo</span>.
            </div>
          )}
        </div>
      </Section>

      {/* Usage */}
      <Section
        title="Usage this period"
        subtitle="Track your monthly document analysis quota."
      >
        {!quota ? (
          <p className="text-sm text-zinc-500">No usage limits apply.</p>
        ) : (
          <div className="space-y-2 text-sm">
            <div>
              Documents analyzed:{" "}
              <strong>
                {quota.used} / {quota.limit === -1 ? "Unlimited" : quota.limit}
              </strong>
            </div>
            {quotaWindow?.resets_on && (
              <div className="text-zinc-600">
                Resets on {new Date(quotaWindow.resets_on).toLocaleDateString()}
              </div>
            )}
          </div>
        )}
      </Section>

      {/* Plans */}
      {(showStarter || showConsultant) && (
        <Section
          title={currentPlan === "starter" ? "Upgrade your plan" : "Choose a plan"}
          subtitle="Pick a plan that matches your current needs. You can change it anytime."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {showStarter && (
              <PlanCard
                title="Starter"
                price="AUD $149"
                description="For SMEs formalising compliance processes"
                bullets={[
                  "Up to 5 users",
                  "10 documents / month",
                  "Obligation extraction & summaries",
                  "Export to PDF / Excel",
                ]}
                cta={selectedPlan === "starter" ? "Selected" : "Select Starter"}
                highlight={selectedPlan === "starter"}
                disabled={isBusy}
                onClick={() => setSelectedPlan("starter")}
              />
            )}

            {showConsultant && (
              <PlanCard
                title="Consultant"
                price="AUD $399"
                description="For consultants, auditors, and boutique advisory firms"
                bullets={[
                  "Up to 10 users",
                  "30 documents / month",
                  "Multi-client workspaces",
                  "Client-ready exports & tagging",
                ]}
                cta={selectedPlan === "consultant" ? "Selected" : "Select Consultant"}
                highlight={selectedPlan === "consultant"}
                disabled={isBusy}
                onClick={() => setSelectedPlan("consultant")}
              />
            )}
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <a
              href="mailto:sales@audit-iq.com"
              className="text-sm text-blue-600 underline"
            >
              Looking for Enterprise? Contact sales
            </a>

            {/* If user selects a plan manually (without query intent), show a nudge CTA */}
            {currentPlan === "demo" && selectedPlan && !showCheckoutPanel && (
              <button
                className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-60"
                onClick={proceedToCheckout}
                disabled={!canProceedCheckout || isBusy}
              >
                {submitting ? "Redirecting…" : "Continue to payment"}
              </button>
            )}
          </div>
        </Section>
      )}

      {/* Team management placeholder (future) */}
      <Section
        title="Team management"
        subtitle="Invite members, manage access, and monitor seats (owner/admin only)."
      >
        <div className="text-sm text-zinc-600">
          Coming next: member list, invites, role management, and seat limits tied to plan entitlements.
        </div>
      </Section>
    </main>
  );
}

export default function BillingPage() {
  return (
    <RequireAuth>
      <BillingInner />
    </RequireAuth>
  );
}
