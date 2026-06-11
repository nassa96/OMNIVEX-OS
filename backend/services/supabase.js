import { createClient } from "@supabase/supabase-js";

let client;

export function initSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase ENV (SUPABASE_URL / SUPABASE_SERVICE_KEY)");
  }

  client = createClient(url, key);
  console.log("[Supabase] connected");
  return client;
}

export function getSupabase() {
  return client;
}

export async function writeCheckpoint(data) {
  const db = getSupabase();

  if (!db) return;

  const { error } = await db.from("checkpoints").insert([
    {
      created_at: new Date().toISOString(),
      payload: data
    }
  ]);

  if (error) console.error("[Checkpoint Error]", error);
}
