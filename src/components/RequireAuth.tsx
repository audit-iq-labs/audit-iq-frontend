"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

type Props = {
  children: React.ReactNode;
  /** Optional: show while we check session */
  fallback?: React.ReactNode;
};

/**
 * Minimal client-side auth gate for MVP.
 * Redirects unauthenticated users to /login?next=<path>.
 */
export default function RequireAuth({ children, fallback }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function run() {
      setChecking(true);
      const { data } = await supabase.auth.getSession();
      const sess = data.session ?? null;

      if (!mounted) return;

      if (!sess) {
        const qs = searchParams?.toString();
        const next = qs ? `${pathname}?${qs}` : pathname;
        router.replace(`/login?next=${encodeURIComponent(next)}`);
        return;
      }

      setSession(sess);
      setChecking(false);
    }

    run();
    return () => {
      mounted = false;
    };
  }, [router, pathname, searchParams]);

  if (checking) {
    return (
      fallback ?? (
        <div className="p-6 text-sm text-gray-500">Checking session…</div>
      )
    );
  }

  // (session is available if you want to extend this into a context later)
  void session;
  return <>{children}</>;
}
