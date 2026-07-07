// backend/agents/chronicle.js

export default function chronicle(bus) {
  const memory = [];

  function record(event) {
    memory.push(event);

    // hard cap memory to avoid Termux crash
    if (memory.length > 5000) {
      memory.shift();
    }
  }

  bus.onAny?.((type, event) => {
    record({ type, event });
  });

  bus.on("market.tick", record);
  bus.on("trade.executed", record);
  bus.on("signal", record);

  return {
    snapshot: () => ({
      size: memory.length,
      last: memory[memory.length - 1] || null
    }),

    replay: (n = 10) => memory.slice(-n)
  };
}
