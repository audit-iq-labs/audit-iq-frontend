// src/app/(public)/login/page.tsx

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams?.get("next") ?? "/projects";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
        const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        });

        if (error) {
        setMsg(error.message);
        return;
        }

        // Ensure session exists (cookie may be set asynchronously)
        const { data: s } = await supabase.auth.getSession();

        if (!s.session) {
        setMsg("Signed in, but session not ready yet. Please try again.");
        return;
        }

        router.replace(next);
        router.refresh();
    } catch (err: unknown) {
        setMsg(err instanceof Error ? err.message : "Login failed");
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border p-6">
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
        </form>

        <div className="text-sm mt-4">
          New here?{" "}
          <Link className="underline" href={`/signup?next=${encodeURIComponent(next)}`}>
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
