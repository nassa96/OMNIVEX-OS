/**
 * FORGE STRATEGY MUTATION + OPTIMIZER v1
 * --------------------------------------
 * PURPOSE:
 * - Evolve trading strategy parameters
 * - Select high-performing configurations
 * - Mutate weak strategies
 * - Reinforce profitable behaviors
 */

/* =========================
   STRATEGY POOL
========================= */

const strategies = {
  default: {
    entryThreshold: 0.6,
    exitThreshold: 0.3,
    riskMultiplier: 1.0,
    confidenceBias: 1.0,
    fitness: 1.0,
    trades: 0,
    pnl: 0
  }
}

/* =========================
   REGISTER PERFORMANCE
========================= */

export function reportPerformance(strategyId, metrics) {
  if (!strategies[strategyId]) return

  const s = strategies[strategyId]

  s.pnl += metrics.pnl || 0
  s.trades += 1

  const drawdownPenalty = Math.min(0.5, Math.abs(metrics.drawdown || 0))
  const executionPenalty = 1 - (metrics.executionQuality || 0)

  s.fitness =
    (s.pnl * 0.7) -
    (drawdownPenalty * 0.2) -
    (executionPenalty * 0.1)

  return s
}

/* =========================
   STRATEGY MUTATION
========================= */

export function mutateStrategy(baseId, newId) {
  const base = strategies[baseId]
  if (!base) return null

  const mutationFactor = 0.1

  const mutated = {
    entryThreshold: clamp(base.entryThreshold + rand(mutationFactor)),
    exitThreshold: clamp(base.exitThreshold + rand(mutationFactor)),
    riskMultiplier: clamp(base.riskMultiplier + rand(mutationFactor)),
    confidenceBias: clamp(base.confidenceBias + rand(mutationFactor)),
    fitness: 1.0,
    trades: 0,
    pnl: 0
  }

  strategies[newId] = mutated

  return mutated
}

/* =========================
   SELECTION PRESSURE
========================= */

export function selectBestStrategy() {
  let best = null
  let bestScore = -Infinity

  for (const id in strategies) {
    const s = strategies[id]

    const score =
      s.fitness +
      Math.log(1 + s.trades) * 0.1

    if (score > bestScore) {
      bestScore = score
      best = id
    }
  }

  return best
}

/* =========================
   EVOLUTION STEP
========================= */

export function evolve() {
  const best = selectBestStrategy()

  if (!best) return

  const newId = `${best}_mut_${Date.now()}`

  mutateStrategy(best, newId)

  // decay weak strategies
  for (const id in strategies) {
    if (strategies[id].fitness < 0) {
      delete strategies[id]
    }
  }

  return {
    best,
    newStrategy: newId
  }
}

/* =========================
   GET STRATEGY
========================= */

export function getStrategy(id) {
  return strategies[id]
}

/* =========================
   UTILS
========================= */

function rand(scale) {
  return (Math.random() - 0.5) * 2 * scale
}

function clamp(val) {
  return Math.max(0.1, Math.min(1.5, val))
}

/* =========================
   STATE
========================= */

export function getAllStrategies() {
  return strategies
}
