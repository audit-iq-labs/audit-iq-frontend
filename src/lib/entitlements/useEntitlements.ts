// src/lib/entitlements/useEntitlements.ts
"use client";

import { useCallback, useEffect, useState } from "react";
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
  organization_id: string | null;

  plan_id: string;
  plan_name: string;
  status: string;

  entitlements: Record<string, { enabled: boolean; limit: number | null }>;

  usage?: {
    documents_this_period?: number;
    period?: string;
    period_start?: string;
    by_feature?: Record<string, number>;
  };

  limits?: {
    documents_per_month?: number | null;
    [k: string]: number | null | undefined;
  };

  allowed?: Record<string, boolean>;

  quota_window?: {
    period_start: string;
    period_end: string;
    resets_on: string;
    period_key?: string;
  };

  quota?: Record<string, QuotaEntry>;

  package?: {
    plan_id: string;
    plan_name: string;
    status: string;

    trial_ends_at?: string | null;
    current_period_starts_at?: string | null;
    current_period_ends_at?: string | null;

    cancel_at_period_end?: boolean;
    canceled_at?: string | null;
    ended_at?: string | null;

    stripe_customer_id?: string | null;
    stripe_subscription_id?: string | null;
    stripe_price_id?: string | null;
  };

  me?: {
    user_id: string;
    email: string | null;
    name?: string | null;
  };
  organization?: {
    id: string;
    name: string | null;
    role?: string | null;
    country_code?: string | null;
  };
};

export function useEntitlements() {
  const [data, setData] = useState<EntitlementsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiGet("/me/entitlements");
      setData(res);
      return res as EntitlementsResponse;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load entitlements";
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch().catch(() => {});
  }, [refetch]);

  return { data, loading, error, refetch };
}
