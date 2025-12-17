//src/lib/entitlements/useEntitlements.ts

"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/apiClient";

export type QuotaEntry = {
  enabled: boolean;
  limit: number | null;
  used: number;
  remaining: number | null;
  allowed: boolean;
  last_consumed_at?: string | null;
};

export type EntitlementsResponse = {
  package?: {
    plan_id: string;
    plan_name: string;
    status: string;
    trial_ends_at?: string | null;
    current_period_starts_at?: string | null;
    current_period_ends_at?: string | null;
  };
  quota_window?: {
    period_start: string;
    period_end: string;
    resets_on: string;
  };
  quota?: Record<string, QuotaEntry>;
};

export function useEntitlements() {
  const [data, setData] = useState<EntitlementsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setLoading(true);
        const res = await apiGet("/me/entitlements");
        if (!cancelled) setData(res);
      } catch (e: unknown) {
        if (!cancelled) {
          const msg =
            e instanceof Error ? e.message : "Failed to load entitlements";
          setError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}
