// src/app/(app)/(onboarding)/onboarding/organization/page.tsx
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
      ? (localStorage.getItem("plan_intent") as Plan | null)
      : null);

  const next = sp.get("next") || "/billing";

  React.useEffect(() => {
    if (plan === "demo") router.replace("/projects");
  }, [plan, router]);

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

      const url = new URL(next, window.location.origin);
      if (plan) url.searchParams.set("plan", plan);
      url.searchParams.set("org", res.organization_id);

      router.replace(url.pathname + url.search);
      router.refresh();
    } catch (err: any) {
      setMsg(err?.message ?? "Failed to save organization");
    } finally {
      setLoading(false);
    }
  }

  const canContinue =
    Boolean(name.trim()) &&
    (plan === "demo" ? true : Boolean(profile.team_size && profile.use_case));

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

          {/* Capture team_size + use_case here (recommended for paid plans) */}
          {plan !== "demo" && (
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
            {loading ? "Saving..." : "Continue to billing →"}
          </button>
        </form>
      </div>
    </div>
  );
}
