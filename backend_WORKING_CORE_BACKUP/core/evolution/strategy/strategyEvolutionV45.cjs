/**
 * SAINT V45 — STRATEGY EVOLUTION ENGINE
 * -------------------------------------
 * Mutates, selects, and prunes trading strategies based on performance pressure
 */

class StrategyEvolutionV45 {

  constructor() {

    this.population = {};   // active strategies
    this.generation = 0;

    this.history = {};
  }

  // =====================================================
  // REGISTER STRATEGY
  // =====================================================
  register(name, config) {

    this.population[name] = {
      config,
      fitness: 1.0,
      age: 0,
      mutations: 0
    };

    this.history[name] = [];
  }

  // =====================================================
  // RECORD PERFORMANCE
  // =====================================================
  recordPerformance(name, metrics) {

    if (!this.population[name]) return;

    const entry = {
      pnl: metrics.pnl || 0,
      drawdown: metrics.drawdown || 0,
      volatility: metrics.volatility || 0,
      winRate: metrics.winRate || 0,
      ts: Date.now()
    };

    this.history[name].push(entry);

    if (this.history[name].length > 200) {
      this.history[name].shift();
    }
  }

  // =====================================================
  // FITNESS FUNCTION
  // =====================================================
  computeFitness(name) {

    const data = this.history[name];

    if (!data || data.length < 5) return 1.0;

    const avgPnL =
      data.reduce((a, d) => a + d.pnl, 0) / data.length;

    const avgDrawdown =
      data.reduce((a, d) => a + d.drawdown, 0) / data.length;

    const winRate =
      data.filter(d => d.pnl > 0).length / data.length;

    const fitness =
      (avgPnL * 0.5) +
      (winRate * 0.3) -
      (avgDrawdown * 0.4);

    this.population[name].fitness = fitness;

    return fitness;
  }

  // =====================================================
  // MUTATE STRATEGY
  // =====================================================
  mutate(config) {

    const mutated = { ...config };

    // small random perturbations
    for (const key in mutated) {

      if (typeof mutated[key] === "number") {
        mutated[key] *= (0.9 + Math.random() * 0.2);
      }
    }

    return mutated;
  }

  // =====================================================
  // SELECT BEST STRATEGIES
  // =====================================================
  selectTop(n = 3) {

    return Object.entries(this.population)
      .sort((a, b) => b[1].fitness - a[1].fitness)
      .slice(0, n);
  }

  // =====================================================
  // PRUNE WEAK STRATEGIES
  // =====================================================
  prune(threshold = 0.3) {

    for (const name in this.population) {

      this.computeFitness(name);

      if (this.population[name].fitness < threshold) {
        delete this.population[name];
      }
    }
  }

  // =====================================================
  // EVOLVE GENERATION
  // =====================================================
  evolve() {

    this.generation++;

    const top = this.selectTop(3);

    const newStrategies = {};

    // survive + mutate best
    for (const [name, strategy] of top) {

      const mutatedConfig = this.mutate(strategy.config);

      const newName = `${name}_g${this.generation}`;

      newStrategies[newName] = {
        config: mutatedConfig,
        fitness: 1.0,
        age: 0,
        mutations: strategy.mutations + 1
      };
    }

    // replace population with evolved strategies
    this.population = {
      ...this.population,
      ...newStrategies
    };

    return {
      generation: this.generation,
      populationSize: Object.keys(this.population).length
    };
  }

  // =====================================================
  // SNAPSHOT
  // =====================================================
  snapshot() {

    return {
      generation: this.generation,
      population: Object.keys(this.population).length
    };
  }
}

module.exports = StrategyEvolutionV45;
