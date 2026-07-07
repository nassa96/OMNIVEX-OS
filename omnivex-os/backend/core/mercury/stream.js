import { broadcast } from "../bridge/wsServer.js";
import { streamEvent } from "../bridge/chronicleStream.js";

/**
 * OMNIVEX — MERCURY MARKET STREAM
 * Normalizes market ticks and pushes to CHRONICLE + WS
 */

let interval = null;

/**
 * MOCK STREAM (replace later with exchange feeds)
 */
function generateTick() {
  const symbols = ["BTC-USD", "ETH-USD", "SOL-USD"];
  const symbol = symbols[Math.floor(Math.random() * symbols.length)];

  const price = 100 + Math.random() * 1000;

  return {
    type: "MARKET",
    source: "MERCURY",
    symbol,
    price,
    ts: Date.now()
  };
}

/**
 * START STREAM
 */
export function startMercuryStream() {
  if (interval) return;

  interval = setInterval(() => {
    const tick = generateTick();

    // 1. persist to chronicle
    streamEvent(tick);

    // 2. broadcast raw market tick
    broadcast({
      ...tick,
      stream: "MERCURY"
    });
  }, 800);

  return true;
}

/**
 * STOP STREAM
 */
export function stopMercuryStream() {
  clearInterval(interval);
  interval = null;
}
