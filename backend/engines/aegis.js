export function Aegis(state, price, signal) {
  const risk = {
    exposure: 0,
    positionSize: 0,
    riskLevel: "LOW"
  };

  const trades = state.trades || [];
  const active = trades.find(t => t.open);

  // Base volatility proxy
  const lastEntry = active?.entry || price;
  const drawdown = price - lastEntry;

  // Risk scoring
  if (Math.abs(drawdown) > lastEntry * 0.02) {
    risk.riskLevel = "HIGH";
    risk.positionSize = 0.2;
  } else if (Math.abs(drawdown) > lastEntry * 0.01) {
    risk.riskLevel = "MEDIUM";
    risk.positionSize = 0.5;
  } else {
    risk.riskLevel = "LOW";
    risk.positionSize = 1.0;
  }

  // Signal suppression under high risk
  if (risk.riskLevel === "HIGH" && signal === "BUY") {
    return {
      ...risk,
      signalOverride: "HOLD"
    };
  }

  return {
    ...risk,
    signalOverride: signal
  };
}
