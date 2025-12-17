// src/app/page.tsx

"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams?.get("next") ?? "/projects";

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.replace(next);
      } else {
        router.replace(`/login?next=${encodeURIComponent(next)}`);
      }
    })();
  }, [router, next]);

  return (
    <main className="min-h-screen flex items-center justify-center p-6 text-sm text-gray-500">
      Redirecting…
    </main>
  );
}

