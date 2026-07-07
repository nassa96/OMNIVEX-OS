import { EventBus } from "../bus/eventBus.js";

export function startSophia() {
  EventBus.on("MERCURY_TICK", (tick) => {
    const signal =
      tick.price % 2 === 0 ? "BUY" : "HOLD";

    EventBus.emit("SOPHIA_SIGNAL", {
      ...tick,
      signal,
      strength: 0.5
    });
  });
}
