import { supabase } from "../chronicle/db.js";
import { getMarketBundle } from "../mercury/marketHub.js";

/**
 * SNAPSHOT = DERIVED STATE ONLY
 * No RAM truth allowed
 */

export async function buildSnapshot() {
  const { data: events, error } = await supabase
    .from("omnivex_events")
    .select("*")
    .order("ts", { ascending: false })
    .limit(200);

  if (error) {
    console.error("[SNAPSHOT ERROR]", error.message);
  }

  const executions = (events || [])
    .filter(e => e.type === "EXECUTION")
    .map(e => e.payload);

  const positions = executions.reduce((acc, e) => {
    if (!e.symbol) return acc;
    acc[e.symbol] = e.position || acc[e.symbol] || null;
    return acc;
  }, {});

  const market = await getMarketBundle();

  return {
    timestamp: Date.now(),
    market,
    executions,
    positions,
    lastUpdate: Date.now()
  };
}
