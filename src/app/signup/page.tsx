// src/app/signup/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      // IMPORTANT: must match Supabase Auth Redirect URLs.
      options: { emailRedirectTo: `${window.location.origin}/login` },
    });

    setLoading(false);

    if (error) {
      setMsg(error.message);
      return;
    }

    // If email confirmation is ON, session will be null and user must confirm email.
    if (!data.session) {
      setMsg("Signup successful. Please check your email to confirm, then login.");
      return;
    }

    router.replace("/projects");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border p-6">
        <h1 className="text-2xl font-semibold">Create your account</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Use email + password (you can add OAuth later).
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <div>
            <label className="text-sm">Email</label>
            <input
              className="w-full border rounded-md px-3 py-2 mt-1"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="text-sm">Password</label>
            <input
              className="w-full border rounded-md px-3 py-2 mt-1"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>

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
            {loading ? "Creating..." : "Sign up"}
          </button>
        </form>

        <div className="text-sm mt-4">
          Already have an account?{" "}
          <Link className="underline" href="/login">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
