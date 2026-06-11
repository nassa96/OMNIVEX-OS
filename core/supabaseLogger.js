// ============================================================
// SAINT OMNIVEX — SUPABASE LOGGER
// File: core/supabaseLogger.js
// Persists all trade executions, blocks, and signals to Supabase.
// ============================================================

import { createClient } from "@supabase/supabase-js";

let supabase = null;
let connected = false;

export function initSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn("[SUPABASE] No credentials found — logging disabled");
    return false;
  }

  try {
    supabase = createClient(url, key);
    connected = true;
    console.log("[SUPABASE] Connected ✓");
    return true;
  } catch (err) {
    console.error("[SUPABASE] Init failed:", err.message);
    return false;
  }
}

export async function logSignal({ signal, confidence, risk, price, volatility, reason, allowed }) {
  if (!connected || !supabase) return;
  try {
    await supabase.from("signals").insert({
      signal,
      confidence,
      risk,
      price,
      volatility,
      reason,
      allowed,
      created_at: new Date().toISOString()
    });
  } catch (err) {
    console.error("[SUPABASE] logSignal error:", err.message);
  }
}

export async function logTrade({ signal, confidence, price, pnl, trades }) {
  if (!connected || !supabase) return;
  try {
    await supabase.from("trades").insert({
      signal,
      confidence,
      price,
      pnl,
      trade_number: trades,
      created_at: new Date().toISOString()
    });
  } catch (err) {
    console.error("[SUPABASE] logTrade error:", err.message);
  }
}

export async function logChat({ userId, message, reply }) {
  if (!connected || !supabase) return;
  try {
    await supabase.from("chat_logs").insert({
      user_id: userId || "anonymous",
      message,
      reply,
      created_at: new Date().toISOString()
    });
  } catch (err) {
    console.error("[SUPABASE] logChat error:", err.message);
  }
}

export function isConnected() {
  return connected;
}

