"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AppAuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const isAuthed = !!data.session;

        if (!isAuthed) {
          // preserve full deep link: pathname + query string
          const qs = searchParams?.toString();
          const next = qs ? `${pathname}?${qs}` : pathname;

          router.replace(`/login?next=${encodeURIComponent(next)}`);
          return;
        }
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router, pathname, searchParams]);

  // Prevent flashing app UI while we check session
  if (checking) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-sm text-gray-600">
        Loading…
      </div>
    );
  }

  return <>{children}</>;
}
