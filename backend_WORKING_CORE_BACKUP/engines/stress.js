export function computeMarketStress({ correlation, regimes }) {
  const corrAvg =
    (Math.abs(correlation.BTC_ETH) +
      Math.abs(correlation.BTC_SOL) +
      Math.abs(correlation.ETH_SOL)) / 3;

  const regimeAlignment =
    regimes.filter(r => r.regime === "CHOP").length;

  let stress = "LOW";

  if (corrAvg > 0.75) stress = "HIGH";
  else if (corrAvg > 0.5) stress = "MEDIUM";

  if (regimeAlignment >= 2) stress = "HIGH";

  return {
    stress,
    correlationStrength: corrAvg,
    chopClusters: regimeAlignment
  };
}
