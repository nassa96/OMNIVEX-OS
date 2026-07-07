/**
 * ATLAS AGENT EVOLUTION ENGINE V1
 * Mutates and selects strategies based on performance
 */

const POPULATION = {
  BTC: [],
  ETH: [],
  SOL: []
};

const BASE_STRATEGIES = [
  "momentum",
  "mean_reversion",
  "breakout",
  "regime_follow",
  "noise_filter"
];

/* =========================
   INITIALIZE POPULATION
========================= */
export function initPopulation(symbol) {
  if (!POPULATION[symbol].length) {
    POPULATION[symbol] = BASE_STRATEGIES.map(s => ({
      strategy: s,
      fitness: 0,
      uses: 0,
      wins: 0
    }));
  }
}

/* =========================
   SELECT STRATEGY
========================= */
export function evolveStrategy(symbol) {
  initPopulation(symbol);

  const pool = POPULATION[symbol];

  const selected = weightedPick(pool);

  selected.uses += 1;

  return selected.strategy;
}

/* =========================
   UPDATE FITNESS
========================= */
export function updateFitness(symbol, strategy, outcome) {
  const pool = POPULATION[symbol];

  const agent = pool.find(a => a.strategy === strategy);
  if (!agent) return;

  agent.wins += outcome > 0 ? 1 : 0;

  agent.fitness = agent.wins / (agent.uses || 1);

  mutateIfStagnant(symbol);
}

/* =========================
   MUTATION LOGIC
========================= */
function mutateIfStagnant(symbol) {
  const pool = POPULATION[symbol];

  const worst = pool.sort((a, b) => a.fitness - b.fitness)[0];

  if (worst.fitness < 0.3 && worst.uses > 10) {
    worst.strategy = mutateStrategy(worst.strategy);
    worst.fitness = 0;
    worst.uses = 0;
    worst.wins = 0;
  }
}

function mutateStrategy(strategy) {
  const mutations = [
    strategy + "_v2",
    "hybrid_" + strategy,
    strategy + "_adaptive"
  ];

  return mutations[Math.floor(Math.random() * mutations.length)];
}

/* =========================
   SELECTION
========================= */
function weightedPick(pool) {
  const total = pool.reduce((sum, p) => sum + (p.fitness + 0.01), 0);

  let r = Math.random() * total;

  for (const p of pool) {
    r -= (p.fitness + 0.01);
    if (r <= 0) return p;
  }

  return pool[0];
}

/* =========================
   DEBUG
========================= */
export function getPopulation(symbol) {
  return POPULATION[symbol];
}
