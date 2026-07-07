const { validateSignal } = require("../schemas/signalSchema.cjs");

class SignalSanitizer {
  sanitize(rawSignal) {
    const result = validateSignal(rawSignal);

    if (!result.valid) {
      console.log("[SIGNAL REJECTED]", result.error);

      return {
        valid: false,
        error: result.error,
        original: rawSignal
      };
    }

    // enforce canonical shape
    return {
      valid: true,
      signal: {
        id: this.uuid(),
        timestamp: Date.now(),

        type: "SIGNAL",

        symbol: rawSignal.symbol,
        price: Number(rawSignal.price),

        side: rawSignal.side,
        confidence: Number(rawSignal.confidence),

        strategy: rawSignal.strategy || "unknown",

        source: rawSignal.source || "SOPHIA",

        metadata: rawSignal.metadata || {},

        risk: {
          approved: true,
          score: 0,
          reason: null
        },

        execution: {
          status: "PENDING",
          exchange: "coinbase",
          orderId: null
        }
      }
    };
  }

  uuid() {
    return "sig_" + Math.random().toString(36).substring(2, 10);
  }
}

module.exports = new SignalSanitizer();
