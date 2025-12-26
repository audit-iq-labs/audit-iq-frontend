"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiPost } from "@/lib/apiClient";

type Plan = "demo" | "starter" | "consultant" | "enterprise";

function normalizePlan(v: string | null): Plan | null {
  if (!v) return null;
  const x = v.toLowerCase();
  if (x === "demo" || x === "starter" || x === "consultant" || x === "enterprise") return x;
  return null;
}

function safeNext(raw: string | null, fallback: string) {
  if (!raw) return fallback;
  // only allow relative paths
  if (!raw.startsWith("/")) return fallback;
  // restrict to app routes only (prevents redirecting to random public pages)
  if (!raw.startsWith("/app")) return fallback;
  return raw;
}

type ProfileBasics = {
  team_size: string;
  use_case: string;
};

export default function OrgOnboardingPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const plan =
    normalizePlan(sp.get("plan")) ??
    (typeof window !== "undefined"
      ? (normalizePlan(localStorage.getItem("plan_intent")) as Plan | null)
      : null);

  // IMPORTANT: default to app billing (not "/billing")
  const next = safeNext(sp.get("next"), "/billing");

  // Demo users should not see org onboarding at all
  React.useEffect(() => {
    if (plan === "demo") {
      router.replace("/app/projects");
      router.refresh();
    }
  }, [plan, router]);

  // prevent UI flicker while redirecting demo users
  if (plan === "demo") return null;

  const [name, setName] = React.useState("");
  const [countryCode, setCountryCode] = React.useState("AU");

  const [profile, setProfile] = React.useState<ProfileBasics>({
    team_size: "",
    use_case: "",
  });

  const [loading, setLoading] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      const res = (await apiPost("/api/onboarding/organization", {
        name,
        country_code: countryCode || null,
        team_size: profile.team_size || null,
        use_case: profile.use_case || null,
      })) as { status: string; organization_id: string };

      // next is sanitized already; keep plan if present (starter/consultant)
      const url = new URL(next, window.location.origin);
      if (plan && plan !== "demo") url.searchParams.set("plan", plan);
      url.searchParams.set("org", res.organization_id);

      router.replace(url.pathname + url.search);
      router.refresh();
    } catch (err: any) {
      setMsg(err?.message ?? "Failed to save organization");
    } finally {
      setLoading(false);
    }
  }

  // If plan is missing (e.g., user came via header signup), still allow them through.
  // Billing can be the plan selection step.
  const paidPlan = plan === "starter" || plan === "consultant" || plan === "enterprise";

  const canContinue =
    Boolean(name.trim()) &&
    (paidPlan ? Boolean(profile.team_size && profile.use_case) : true);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-xl border p-6 bg-white">
        <h1 className="text-2xl font-semibold">Set up your organisation</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Required for billing and compliance tracking. You can change this later.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm">Organisation name *</label>
            <input
              className="w-full border rounded-md px-3 py-2 mt-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Acme Pty Ltd"
              required
            />
          </div>

          <div>
            <label className="text-sm">Country (ISO-2)</label>
            <input
              className="w-full border rounded-md px-3 py-2 mt-1"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
              placeholder="AU"
              maxLength={2}
            />
            <p className="text-xs text-zinc-500 mt-1">Example: AU, IN, DE</p>
          </div>

          {/* Only require these fields for paid plan paths; demo already skipped */}
          {paidPlan && (
            <div className="space-y-3">
              <select
                className="w-full border rounded px-3 py-2"
                value={profile.team_size}
                onChange={(e) => setProfile({ ...profile, team_size: e.target.value })}
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
                onChange={(e) => setProfile({ ...profile, use_case: e.target.value })}
              >
                <option value="">Primary use case</option>
                <option value="internal">My own organisation</option>
                <option value="consulting">Client consulting</option>
              </select>
            </div>
          )}

          {msg && (
            <div className="text-sm rounded-md bg-zinc-50 border px-3 py-2">
              {msg}
            </div>
          )}

          <button
            className="w-full rounded-md bg-black text-white px-4 py-2 disabled:opacity-60"
            disabled={loading || !canContinue}
            type="submit"
          >
            {loading ? "Saving..." : "Continue →"}
          </button>
        </form>
      </div>
    </div>
  );
}
