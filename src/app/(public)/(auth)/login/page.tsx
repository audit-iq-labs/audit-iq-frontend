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

  const [msg, setMsg] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  // Forgot/reset mode
  const [forgotMode, setForgotMode] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);

  useEffect(() => {
    if (planFromQuery) localStorage.setItem("plan_intent", planFromQuery);
    if (next) localStorage.setItem("post_auth_next", next);
  }, [planFromQuery, next]);

  function enterForgotMode() {
    setMsg(null);
    setForgotMode(true);
    setPassword(""); // safety
  }

  function exitForgotMode() {
    setMsg(null);
    setForgotMode(false);
    setPassword("");
  }

  async function sendResetEmail() {
    const e = email.trim();
    if (!e) {
      setMsg("Please enter your email first.");
      return;
    }

    setSendingReset(true);
    setMsg(null);

    const { error } = await supabase.auth.resetPasswordForEmail(e, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    if (error) {
      setMsg(error.message);
    } else {
      setMsg(`Password reset email sent to ${e}. Check your inbox.`);
    }

    setSendingReset(false);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (forgotMode) return;

    const e1 = email.trim();
    if (!e1) {
      setMsg("Please enter your email.");
      return;
    }

    setSigningIn(true);
    setMsg(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: e1,
        password,
      });

      if (error) {
        setMsg(error.message);
        return;
      }

      const session = await waitForSession();
      if (!session) {
        setMsg("Signed in, but session not ready yet. Please try again.");
        return;
      }

      const plan = planFromQuery ?? normalizePlan(localStorage.getItem("plan_intent"));
      const url = new URL(next, window.location.origin);
      if (plan) url.searchParams.set("plan", plan);

      router.replace(url.pathname + url.search);
      router.refresh();
    } catch (err: unknown) {
      setMsg(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSigningIn(false);
    }
  }

  const isBusy = signingIn || sendingReset;

  return (
    <div className="flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border p-6 bg-white">
        <h1 className="text-2xl font-semibold">{forgotMode ? "Reset your password" : "Login"}</h1>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <input
            className="w-full border rounded-md px-3 py-2"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isBusy}
          />

          {!forgotMode && (
            <input
              className="w-full border rounded-md px-3 py-2"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isBusy}
            />
          )}

          {msg && (
            <div className="text-sm rounded-md bg-zinc-50 border px-3 py-2">
              {msg}
            </div>
          )}

          {!forgotMode ? (
            <button
              className="w-full rounded-md bg-black text-white px-4 py-2 disabled:opacity-60"
              disabled={isBusy}
              type="submit"
            >
              {signingIn ? "Signing in..." : "Login"}
            </button>
          ) : (
            <>
              <button
                className="w-full rounded-md bg-black text-white px-4 py-2 disabled:opacity-60"
                disabled={isBusy}
                type="button"
                onClick={sendResetEmail}
              >
                {sendingReset ? "Sending…" : "Send reset email"}
              </button>

              <p className="text-xs text-zinc-500">
                We’ll email you a secure link to set a new password.
              </p>
            </>
          )}

          {/* Bottom row: Create account + Forgot/Back on same line */}
          <div className="flex items-center justify-between text-sm pt-1">
            <div className="min-w-0">
              <span className="text-zinc-600">New here?</span>{" "}
              <Link
                className="underline hover:text-black"
                href={`/signup?next=${encodeURIComponent(next)}${
                  planFromQuery ? `&plan=${encodeURIComponent(planFromQuery)}` : ""
                }`}
              >
                Create an account
              </Link>
            </div>

            {forgotMode ? (
              <button
                type="button"
                onClick={exitForgotMode}
                className="underline text-zinc-600 hover:text-black disabled:opacity-60"
                disabled={isBusy}
              >
                Back to login
              </button>
            ) : (
              <button
                type="button"
                onClick={enterForgotMode}
                className="underline text-zinc-600 hover:text-black disabled:opacity-60"
                disabled={isBusy}
              >
                Forgot password?
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
