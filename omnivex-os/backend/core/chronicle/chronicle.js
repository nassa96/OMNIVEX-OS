import { supabase } from "./db.js";

/**
 * OMNIVEX CHRONICLE
 * SINGLE SOURCE OF TRUTH (Supabase)
 */

export async function recordEvent(event) {
  try {
    const { error } = await supabase
      .from("omnivex_events")
      .insert([
        {
          ts: Date.now(),
          type: event.type,
          symbol: event.symbol || null,
          payload: event.payload || event
        }
      ]);

    if (error) {
      console.error("[CHRONICLE WRITE FAILED]", error.message);
    }
  } catch (err) {
    console.error("[CHRONICLE CRITICAL]", err);
  }
}
