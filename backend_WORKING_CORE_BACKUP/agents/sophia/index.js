import { RUNTIME_FLAGS } from "../../core/runtimeFlags.js";

export function runSophia(symbol, price, prev) {
  const momentum = (price - prev) / prev;

  let signal = "HOLD";

  if (momentum > RUNTIME_FLAGS.MIN_SIGNAL_STRENGTH) {
    signal = "BUY";
  }

  if (momentum < -RUNTIME_FLAGS.MIN_SIGNAL_STRENGTH) {
    signal = "SELL";
  }

  return {
    type: "SOPHIA_SIGNAL",
    symbol,
    price,
    prev,
    momentum,
    signal
  };
}
