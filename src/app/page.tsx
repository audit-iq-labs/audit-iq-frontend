// src/app/page.tsx

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams?.get("next");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.replace(next ?? "/projects");
      }
    })();
  }, [router, next]);

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-zinc-50">
      <div className="w-full max-w-lg rounded-2xl border bg-white p-8 space-y-5 shadow-sm">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Audit-IQ</h1>
          <p className="text-sm text-gray-600">
            From regulation → obligations → evidence → audit readiness.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"}
            className="rounded-md bg-black text-white px-4 py-2 text-sm"
          >
            Log in
          </Link>

          <Link
            href={next ? `/signup?next=${encodeURIComponent(next)}` : "/signup"}
            className="rounded-md border px-4 py-2 text-sm"
          >
            Sign up
          </Link>
        </div>

        <p className="text-xs text-gray-500">
          Tip: after you log in, you’ll land in <span className="font-medium">Projects</span>.
        </p>
      </div>
    </main>
  );
}
