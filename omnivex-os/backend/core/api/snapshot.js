import { ledger } from "../ledger/ledger.js";
import { getMercuryFeed } from "../mercury/mercury.js";

export async function buildSnapshot() {
  const market = getMercuryFeed();

  return {
    system: "OMNIVEX_OS",
    timestamp: Date.now(),
    market,
    ledger,
    lastSignal: "HOLD",
    positions: ledger.positions,
    executions: ledger.executions,
    lastUpdate: Date.now()
  };
}
