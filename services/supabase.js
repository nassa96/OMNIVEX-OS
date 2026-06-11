import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

/**
 * Safe Supabase init (NEVER throws on import)
 */
export function initSupabase() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn("[SUPABASE] Running in OFFLINE MODE (no credentials)");
    return null;
  }

  return createClient(SUPABASE_URL, SUPABASE_KEY);
}

/**
 * Singleton client
 */
export const supabase = initSupabase();

/**
 * Insert signal safely
 */
export async function insertSignal(signalObj) {
  if (!supabase) return { offline: true };

  const { data, error } = await supabase
    .from("signals")
    .insert([signalObj]);

  if (error) {
    console.error("[SUPABASE] insertSignal error:", error.message);
    return { error };
  }

  return { data };
}

/**
 * Insert trade safely
 */
export async function insertTrade(tradeObj) {
  if (!supabase) return { offline: true };

  const { data, error } = await supabase
    .from("trades")
    .insert([tradeObj]);

  if (error) {
    console.error("[SUPABASE] insertTrade error:", error.message);
    return { error };
  }

  return { data };
}
