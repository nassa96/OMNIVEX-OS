export function saint(signal, price, risk) {
  const size = risk.level === "HIGH" ? 0.5 : 1;

  const roi = signal === "BUY"
    ? Math.random() * 1.5
    : signal === "SELL"
      ? Math.random() * -1
      : 0;

  return {
    signal,
    roi,
    size,
    risk: risk.level
  };
}
