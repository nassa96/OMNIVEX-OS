import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export async function saveCheckpoint(state) {
  const payload = {
    timestamp: Date.now(),
    btc_price: state.btc?.price,
    eth_price: state.eth?.price,
    signal: state.signal,
    confidence: state.confidence,
    risk: state.risk,
    allow: state.allow,
    version: "atlas-v1"
  };

  const { error } = await supabase
    .from("system_checkpoints")
    .insert(payload);

  if (error) {
    console.log("[CHECKPOINT ERROR]", error.message);
  } else {
    console.log("[CHECKPOINT SAVED]");
  }
}
