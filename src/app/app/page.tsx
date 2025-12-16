// src/app/app/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { apiGet } from "@/lib/apiClient";

export default function AppHome() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        router.push("/login");
        return;
      }

      try {
        const me = await apiGet("/me");
        const ent = await apiGet("/me/entitlements");
        setData({ me, ent });
      } catch (e: any) {
        setErr(e.message ?? String(e));
      }
    })();
  }, [router]);

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <h1>Audit-IQ App</h1>

      {err && <p style={{ color: "crimson" }}>{err}</p>}
      {!data && !err && <p>Loading…</p>}

      {data && (
        <pre style={{ background: "#111", color: "#0f0", padding: 12, overflowX: "auto" }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
