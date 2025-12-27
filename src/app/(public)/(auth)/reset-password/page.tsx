// src/app/(public)/(auth)/reset-password/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [hasSession, setHasSession] = useState<boolean | null>(null);

  // Ensure we actually have a recovery session
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(!!data.session);
      if (!data.session) {
        setMsg("This password reset link is invalid or has expired.");
      }
    });
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (password.length < 8) {
      setMsg("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirm) {
      setMsg("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMsg(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);

    // Gentle redirect after success
    setTimeout(() => {
      router.replace("/login");
      router.refresh();
    }, 1500);
  }

  return (
    <div className="flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border p-6 bg-white">
        <h1 className="text-2xl font-semibold">Reset password</h1>
        <p className="text-sm text-zinc-600 mt-1">
          Choose a new password for your account.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <input
            className="w-full border rounded-md px-3 py-2"
            placeholder="New password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading || success || hasSession === false}
          />

          <input
            className="w-full border rounded-md px-3 py-2"
            placeholder="Confirm new password"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            disabled={loading || success || hasSession === false}
          />

          <p className="text-xs text-zinc-500 -mt-2">
            Minimum 8 characters. Use a strong, unique password.
          </p>

          {msg && (
            <div className="text-sm rounded-md bg-zinc-50 border px-3 py-2">
              {msg}
            </div>
          )}

          {success ? (
            <div className="text-sm rounded-md bg-green-50 border border-green-200 px-3 py-2 text-green-700">
              Password updated successfully. Redirecting to login…
            </div>
          ) : (
            <button
              className="w-full rounded-md bg-black text-white px-4 py-2 disabled:opacity-60"
              disabled={loading || hasSession === false}
              type="submit"
            >
              {loading ? "Updating password…" : "Update password"}
            </button>
          )}
        </form>

        <div className="text-sm mt-4 text-center">
          <Link
            className="underline text-zinc-600 hover:text-black"
            href="/login"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
