class Saint {
  constructor(forge, chronicle) {
    this.forge = forge;
    this.chronicle = chronicle;
    this.positions = {};
  }

  execute(decision, market, aegisDecision) {
    const trades = [];

    // 🛑 AEGIS HARD BLOCK
    if (!aegisDecision.allowed) {
      this.chronicle.write({
        type: "SAINT_BLOCKED",
        reason: aegisDecision.reason
      });

      return {
        trades: [],
        positions: this.positions,
        blocked: true,
        reason: aegisDecision.reason
      };
    }

    const targets = decision.final
      ? [decision.final]
      : (decision.fallback || []);

    for (const t of targets) {
      const symbol = t.symbol;
      const price = t.price || 0;
      const signal = t.signal;

      const bullish =
        signal === "HOT" ||
        signal === "ATTACK" ||
        signal === "COMPOUND" ||
        signal === "STABLE";

      const pos = this.positions[symbol];

      // ENTRY
      if (bullish && !pos) {
        this.positions[symbol] = {
          symbol,
          entry: price,
          pnl: 0,
          status: "OPEN"
        };

        trades.push({
          type: "ENTRY",
          symbol,
          price,
          agent: t.agent
        });
      }

      // EXIT
      if (!bullish && pos) {
        const pnl = price - pos.entry;

        this.forge.update("SAINT", pnl);

        this.chronicle.write({
          type: "TRADE_CLOSE",
          symbol,
          pnl,
          entry: pos.entry,
          exit: price
        });

        trades.push({
          type: "EXIT",
          symbol,
          pnl,
          price
        });

        delete this.positions[symbol];
      }

      if (pos) {
        pos.pnl = price - pos.entry;
      }
    }

    this.chronicle.write({
      type: "SAINT_EXECUTION",
      trades,
      positions: this.positions
    });

    return {
      trades,
      positions: this.positions,
      blocked: false
    };
  }
}

module.exports = Saint;
