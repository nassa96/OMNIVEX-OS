/**
 * AURIN CAPITAL ALLOCATOR v2
 * --------------------------
 * Regime-aware capital sizing engine
 *
 * INPUT:
 * - symbol
 * - price
 * - regime (from SOPHIA)
 * - portfolio state
 *
 * OUTPUT:
 * - position size (0 → 1)
 * - risk decision
 */

const BASE_RISK = 0.02; // 2% base exposure

export function allocateCapital(symbol, price, context = {}) {
  const regime = context.regime || "UNCERTAIN";
  const volatility = context.volatility || 0;

  let multiplier = 1;

  // 🧠 REGIME-BASED ALLOCATION LOGIC
  switch (regime) {
    case "TRENDING_UP":
      multiplier = 1.5;
      break;

    case "TRENDING_DOWN":
      multiplier = 0.5;
      break;

    case "MEAN_REVERT":
      multiplier = 0.8;
      break;

    case "HIGH_VOL":
      multiplier = 0.4;
      break;

    case "LOW_VOL":
      multiplier = 1.0;
      break;

    case "UNCERTAIN":
    default:
      multiplier = 0.2;
      break;
  }

  // volatility dampener
  const volAdjust = volatility > 0
    ? Math.max(0.2, 1 - volatility)
    : 1;

  const size = BASE_RISK * multiplier * volAdjust;

  return {
    symbol,
    size: Number(size.toFixed(4)),
    regime,
    risk: size < 0.01 ? "LOW" : size < 0.03 ? "MEDIUM" : "HIGH"
  };
}

/**
 * GLOBAL CAPITAL HEALTH CHECK
 */
export function capitalHealth(portfolio = []) {
  const totalExposure = portfolio.reduce((sum, p) => sum + (p.size || 0), 0);

  return {
    totalExposure: Number(totalExposure.toFixed(4)),
    status:
      totalExposure > 0.2
        ? "OVEREXPOSED"
        : totalExposure < 0.05
        ? "UNDERUTILIZED"
        : "OPTIMAL"
  };
}
