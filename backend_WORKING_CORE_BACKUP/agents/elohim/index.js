export function runElohim(signals, risk) {
  const decision = {};

  for (const symbol of Object.keys(signals)) {
    const s = signals[symbol];
    const r = risk[symbol];

    if (r.kill) {
      decision[symbol] = { action: "NO_OP" };
      continue;
    }

    if (s.signal === "BUY" && r.risk !== "HIGH") {
      decision[symbol] = { action: "BUY" };
    } else if (s.signal === "SELL") {
      decision[symbol] = { action: "SELL" };
    } else {
      decision[symbol] = { action: "HOLD" };
    }
  }

  return decision;
}
