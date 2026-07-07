// backend/agents/saint.js

export default function saint(bus) {
  let active = true;

  function evaluateSignal(event) {
    if (!active) return;

    const strength = event?.payload?.strength ?? 0;

    if (strength > 0.85) {
      const trade = {
        id: crypto.randomUUID(),
        type: "trade.executed",
        payload: {
          strength,
          source: "SAINT",
          action: "EXECUTE_MARKET"
        },
        ts: Date.now()
      };

      bus.emit("trade.executed", trade);
    }
  }

  bus.on("signal", evaluateSignal);

  bus.on("market.tick", (tick) => {
    const randomSignal = Math.random();

    bus.emit("signal", {
      id: crypto.randomUUID(),
      type: "signal",
      payload: {
        strength: randomSignal,
        source: "SOPHIA"
      },
      ts: Date.now()
    });
  });

  return {
    status: () => ({
      active,
      role: "SAINT_GATE"
    })
  };
}
