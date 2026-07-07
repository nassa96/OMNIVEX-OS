import { createSignal } from "../../kernel/signalContract.js";

/**
 * SOPHIA — MEME DETECTION ENGINE
 * Converts noise → structured alpha signal
 */

export function createMemeDetector({ bus, chronicle }) {
  function detectMeme(payload = {}) {
    const text = JSON.stringify(payload).toLowerCase();

    let score = 0;

    if (text.includes("doge")) score += 0.3;
    if (text.includes("elon")) score += 0.25;
    if (text.includes("pump")) score += 0.2;
    if (text.includes("moon")) score += 0.2;
    if (text.includes("100x")) score += 0.4;

    const strength = Math.min(score, 1);

    const signal = createSignal({
      type: "MEME",
      asset: payload.asset || "MEME_BASKET",
      strength,
      source: "SOPHIA",
      metadata: payload
    });

    if (strength > 0.25) {
      bus.emit("signal.meme", signal);
      chronicle?.append?.(signal);
    }

    return signal;
  }

  bus.onAny((event) => {
    detectMeme(event);
  });

  return { detectMeme };
}
