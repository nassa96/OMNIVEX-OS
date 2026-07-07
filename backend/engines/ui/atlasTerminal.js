function colorize(signal) {
  if (signal === "BUY") return "\x1b[32mBUY\x1b[0m";
  if (signal === "SELL") return "\x1b[31mSELL\x1b[0m";
  return "\x1b[33mHOLD\x1b[0m";
}

export function renderAtlas(event) {
  const lines = [];

  lines.push("\n━━━━━━━━ ATLAS TERMINAL V2 ━━━━━━━━");

  for (const [symbol, data] of Object.entries(event.market)) {
    lines.push(
      `${symbol} | PRICE: ${data.price.toFixed(2)} | SIGNAL: ${colorize(event.signal[symbol]?.signal || "HOLD")} | RISK: ${event.risk[symbol]?.risk || "LOW"}`
    );
  }

  lines.push("━━━━━━━━ EXECUTION LAYER ━━━━━━━━");

  for (const [symbol, exec] of Object.entries(event.decision)) {
    lines.push(`${symbol} → ${exec.action || exec}`);
  }

  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  return lines.join("\n");
}
