// src/app/(public)/(auth)/auth/callback/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

function safeNext(raw: string | null, fallback: string) {
  if (!raw) return fallback;
  // allow only relative paths
  if (!raw.startsWith("/")) return fallback;
  // optionally restrict to your app routes only
  // if (!raw.startsWith("/app")) return fallback;
  return raw;
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const [msg, setMsg] = useState("Completing sign-in...");

  useEffect(() => {
    const run = async () => {
      const fallbackNext = "/app/onboarding/organization";
      const code = sp.get("code");
      const next = safeNext(sp.get("next"), fallbackNext);

      // If user already has a session, just go where we want.
      const { data: sessData } = await supabase.auth.getSession();
      if (sessData.session) {
        router.replace(next);
        router.refresh();
        return;
      }

      if (!code) {
        router.replace(`/login?next=${encodeURIComponent(next)}`);
        return;
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        setMsg("Sign-in link failed. Please login again.");
        router.replace(`/login?next=${encodeURIComponent(next)}`);
        return;
      }

      router.replace(next);
      router.refresh();
    };

    run();
    // intentionally run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return <div className="p-6 text-sm text-zinc-600">{msg}</div>;
}
