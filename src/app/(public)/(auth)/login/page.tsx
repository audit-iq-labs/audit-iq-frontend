// src/app/(public)/(auth)/login/page.tsx

// src/app/(public)/(auth)/login/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Plan = "demo" | "starter" | "consultant" | "enterprise";

function normalizePlan(v: string | null): Plan | null {
  if (!v) return null;
  const x = v.toLowerCase();
  if (x === "demo" || x === "starter" || x === "consultant" || x === "enterprise") return x;
  return null;
}

async function waitForSession(maxTries = 10) {
  for (let i = 0; i < maxTries; i++) {
    const { data } = await supabase.auth.getSession();
    if (data.session) return data.session;
    await new Promise((r) => setTimeout(r, 150));
  }
  return null;
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const next = searchParams?.get("next") ?? "/projects";
  const planFromQuery = normalizePlan(searchParams?.get("plan"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // Persist intent (helps when user bounces around auth pages)
  useEffect(() => {
    if (planFromQuery) localStorage.setItem("plan_intent", planFromQuery);
    if (next) localStorage.setItem("post_auth_next", next);
  }, [planFromQuery, next]);

  async function onForgotPassword() {
    if (!email) {
      setMsg("Please enter your email first.");
      return;
    }

    setLoading(true);
    setMsg(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    if (error) {
      setMsg(error.message);
    } else {
      setMsg("Password reset email sent. Check your inbox.");
    }

    setLoading(false);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMsg(error.message);
        return;
      }

      const session = await waitForSession();
      if (!session) {
        setMsg("Signed in, but session not ready yet. Please try again.");
        return;
      }

      // Mirror signup: preserve plan intent into redirect target
      const plan =
        planFromQuery ??
        normalizePlan(localStorage.getItem("plan_intent"));

      const url = new URL(next, window.location.origin);
      if (plan) url.searchParams.set("plan", plan);

      router.replace(url.pathname + url.search);
      router.refresh();
    } catch (err: unknown) {
      setMsg(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border p-6 bg-white">
        <h1 className="text-2xl font-semibold">Login</h1>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <input
            className="w-full border rounded-md px-3 py-2"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full border rounded-md px-3 py-2"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {msg && (
            <div className="text-sm rounded-md bg-zinc-50 border px-3 py-2">
              {msg}
            </div>
          )}

          <button
            className="w-full rounded-md bg-black text-white px-4 py-2 disabled:opacity-60"
            disabled={loading}
            type="submit"
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          <div className="text-right text-sm">
            <button
              type="button"
              onClick={onForgotPassword}
              className="underline text-zinc-600 hover:text-black"
            >
              Forgot password?
            </button>
          </div>

        </form>

        <div className="text-sm mt-4">
          New here?{" "}
          <Link
            className="underline"
            href={`/signup?next=${encodeURIComponent(next)}${
              planFromQuery ? `&plan=${encodeURIComponent(planFromQuery)}` : ""
            }`}
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
