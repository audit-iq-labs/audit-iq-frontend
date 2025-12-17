// src/app/app/page.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AppHome() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      router.replace(data.session ? "/projects" : "/login?next=%2Fprojects");
    })();
  }, [router]);

  return (
    <div className="p-6 text-sm text-gray-500">Redirecting…</div>
  );
}
