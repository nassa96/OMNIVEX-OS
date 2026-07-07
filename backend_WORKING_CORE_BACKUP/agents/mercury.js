import { EventBus } from "../bus/eventBus.js";

export function startMercury(state) {
  setInterval(() => {
    const drift = (Math.random() - 0.5) * 25;

    state.market.price = Number((state.market.price + drift).toFixed(2));

    const tick = {
      symbol: state.market.symbol,
      price: state.market.price,
      timestamp: Date.now(),
      source: "MERCURY"
    };

    EventBus.emit("MERCURY_TICK", tick);
  }, 1500);
}
