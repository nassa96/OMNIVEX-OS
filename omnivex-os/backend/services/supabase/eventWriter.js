import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function writeEvent(event) {
  if (!process.env.SUPABASE_URL) return;

  return await supabase.from("omnivex_events").insert([event]);
}
