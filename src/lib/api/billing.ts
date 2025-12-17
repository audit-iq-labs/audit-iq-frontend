import { API_BASE_URL, ApiError } from "./client";
import { supabase } from "@/lib/supabaseClient";

export async function createCheckoutSession(plan_id: string): Promise<{ checkout_url: string }> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const res = await fetch(`${API_BASE_URL}/api/billing/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ plan_id }),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new ApiError(res.status, txt || `Checkout failed (${res.status})`, txt);
  }

  return (await res.json()) as { checkout_url: string };
}
