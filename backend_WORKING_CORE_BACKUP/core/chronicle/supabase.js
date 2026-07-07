/**
 * =========================================================
 * CHRONICLE SUPABASE SYNC (OPTIONAL CLOUD LAYER)
 * =========================================================
 * Only activates if env vars exist
 */

const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

let client = null;

if (SUPABASE_URL && SUPABASE_KEY) {
  client = createClient(SUPABASE_URL, SUPABASE_KEY);
}

/**
 * PUSH EVENT TO SUPABASE (non-blocking)
 */
async function syncEvent(event) {
  if (!client) return;

  try {
    await client.from("chronicle").insert([
      {
        type: event.type,
        payload: event,
        ts: Date.now(),
      },
    ]);
  } catch (err) {
    console.log("[SUPABASE SYNC ERROR]", err.message);
  }
}

module.exports = {
  syncEvent,
};
