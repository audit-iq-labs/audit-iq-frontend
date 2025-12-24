// src/lib/api/billing.ts

import { useEffect, useState } from "react";
import { API_BASE_URL, ApiError } from "./client";
import { supabase } from "@/lib/supabaseClient";

type CheckoutResponse = { checkout_url: string; url?: string };
type PortalResponse = { portal_url: string; url?: string };

async function getAuthHeader(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parseErrorText(res: Response): Promise<string> {
  const ct = res.headers.get("content-type") ?? "";
  try {
    if (ct.includes("application/json")) {
      const data = await res.json();
      const d = (data as any)?.detail;
      if (typeof d === "string") return d;
      return JSON.stringify(data).slice(0, 300);
    }
    const txt = await res.text();
    return txt?.trim() ? txt.trim().slice(0, 300) : `Request failed (${res.status})`;
  } catch {
    return `Request failed (${res.status})`;
  }
}

export async function createCheckoutSession(
  organization_id: string,
  plan_id: string,
): Promise<{ checkout_url: string }> {
  const res = await fetch(`${API_BASE_URL}/api/billing/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(await getAuthHeader()),
    },
    body: JSON.stringify({ organization_id, plan_id }),
  });

  if (!res.ok) {
    const msg = await parseErrorText(res);
    throw new ApiError(res.status, msg || `Checkout failed (${res.status})`, msg);
  }

  const data = (await res.json()) as CheckoutResponse;

  // Backend may return either `checkout_url` or `url`
  const checkout_url = data.checkout_url ?? data.url;
  if (!checkout_url) throw new ApiError(500, "Checkout URL missing from response");

  return { checkout_url };
}

export async function createPortalSession(
  organization_id: string,
  return_url?: string,
): Promise<{ portal_url: string }> {
  const res = await fetch(`${API_BASE_URL}/api/billing/portal`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(await getAuthHeader()),
    },
    body: JSON.stringify({ organization_id, ...(return_url ? { return_url } : {}) }),
  });

  if (!res.ok) {
    const msg = await parseErrorText(res);
    throw new ApiError(res.status, msg || "Portal session failed", msg);
  }

  const data = (await res.json()) as PortalResponse;

  // Backend may return either `portal_url` or `url`
  const portal_url = data.portal_url ?? data.url;
  if (!portal_url) throw new ApiError(500, "Portal URL missing from response");

  return { portal_url };
}
