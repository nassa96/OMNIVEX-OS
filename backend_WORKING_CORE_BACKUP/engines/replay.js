import { readEvents } from "../core/chronicle.js";

/**
 * REPLAY ENGINE
 * - deterministic playback of historical ticks
 * - used for backtesting / UI timeline scrub
 */

export function getReplay(limit = 50) {
  return readEvents(limit);
}

/**
 * STREAM REPLAY (simulated playback)
 */
export async function streamReplay(ws, speed = 500) {
  const events = readEvents(200);

  for (const entry of events) {
    if (ws.readyState !== 1) break;

    ws.send(
      JSON.stringify({
        type: "REPLAY_TICK",
        data: entry
      })
    );

    await new Promise(r => setTimeout(r, speed));
  }

  ws.send(JSON.stringify({ type: "REPLAY_END" }));
}
