import { getHistory } from "../chronicle/learningLoop.js";

let strategies = [
  { name: "momentum", weight: 1.0 },
  { name: "mean_reversion", weight: 1.0 },
  { name: "hold_stability", weight: 1.0 }
];

function mutateStrategy(strategy) {
  const drift = (Math.random() - 0.5) * 0.3;
  return {
    ...strategy,
    weight: Math.max(0.1, strategy.weight + drift)
  };
}

function evaluateFitness(history = []) {
  const last = history.slice(-20);

  const score = last.reduce((acc, h) => {
    return acc + (h.reward || 0);
  }, 0);

  return score;
}

function evolve() {
  const history = getHistory();

  const fitness = evaluateFitness(history);

  // mutate all strategies
  strategies = strategies.map(s => mutateStrategy(s));

  // selection pressure (remove weak strategies)
  strategies = strategies.filter(s => s.weight > 0.2);

  // introduce new mutation if system is stagnant
  if (strategies.length < 3 || Math.random() > 0.7) {
    strategies.push({
      name: `mutant_${Date.now()}`,
      weight: 0.5
    });
  }

  return {
    fitness,
    strategies
  };
}

function getStrategies() {
  return strategies;
}

export { evolve, getStrategies };
