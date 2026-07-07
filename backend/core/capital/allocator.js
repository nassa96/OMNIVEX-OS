/**
 * CAPITAL ALLOCATOR V2
 * risk-scaled + equity-smoothed position sizing
 */

function allocate(equity, confidence, volatility) {
  const baseRisk = 0.02;

  const riskAdj = baseRisk * confidence;
  const volAdj = 1 / (1 + volatility);

  const positionSize = equity * riskAdj * volAdj;

  return {
    positionSize,
    risk: riskAdj,
    volatilityAdj: volAdj
  };
}

module.exports = { allocate };
