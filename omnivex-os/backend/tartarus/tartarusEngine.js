const simulations = [];

/**
 * Simulated market generator (stress environments)
 */
function generateScenario(basePrice) {
  const volatility = Math.random();

  return {
    price: basePrice * (1 + (Math.random() - 0.5) * volatility),
    trend: volatility > 0.5 ? "VOLATILE" : "STABLE",
    regime: volatility > 0.7 ? "CRASH" : "NORMAL"
  };
}

/**
 * Run SOPHIA + SAINT logic in simulation mode
 */
function runSimulation({ generateSignal, executeSignal }, iterations = 50) {
  const basePrice = 10000;

  let wins = 0;
  let losses = 0;

  for (let i = 0; i < iterations; i++) {
    const market = generateScenario(basePrice);

    const signal = generateSignal(market);
    const execution = executeSignal(signal, market);

    const pnl = execution.action === "BUY" && market.regime !== "CRASH"
      ? Math.random() * 2
      : -Math.random() * 1;

    if (pnl > 0) wins++;
    else losses++;

    simulations.push({
      market,
      signal,
      execution,
      pnl
    });
  }

  const winRate = wins / iterations;

  return {
    type: "tartarus.simulation_report",
    winRate,
    total: iterations,
    verdict: winRate > 0.55 ? "EVOLVE_STRATEGY" : "WEAK_STRATEGY"
  };
}

function getSimulations() {
  return simulations;
}

module.exports = {
  runSimulation,
  getSimulations
};
