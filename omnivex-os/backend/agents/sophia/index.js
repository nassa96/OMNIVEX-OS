/**
 * SOPHIA — CONTRACT-ALIGNED SIGNAL ENGINE
 */

export function createSophia({ bus }) {

  function generateSignal(data) {

    const event = {
      id: crypto.randomUUID(),
      type: "signal.raw",
      source: "sophia",
      timestamp: Date.now(),
      payload: {
        symbol: data.symbol || "UNKNOWN",
        side: data.side || "NONE",
        strength: Number(data.strength || 0),
        confidence: Number(data.confidence || 0)
      }
    };

    bus.emit("signal.raw", event);

    return event;
  }

  return { generateSignal };
}
