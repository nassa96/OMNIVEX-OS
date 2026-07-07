/**
 * ATLAS AUTOTUNER ENGINE V1
 * Learns from trace outcomes and adjusts system bias
 */

const WEIGHTS = {
  sophia: 1,
  regime: 1,
  strategy: 1,
  risk: 1,
  consensus: 1
};

/* =========================
   UPDATE FROM TRACE
========================= */
export function updateWeightsFromTrace(trace) {
  const outcome = scoreOutcome(trace);

  const adjustment = computeAdjustment(trace, outcome);

  WEIGHTS.sophia += adjustment.sophia;
  WEIGHTS.regime += adjustment.regime;
  WEIGHTS.strategy += adjustment.strategy;
  WEIGHTS.risk += adjustment.risk;
  WEIGHTS.consensus += adjustment.consensus;

  normalizeWeights();

  return WEIGHTS;
}

/* =========================
   OUTCOME SCORING
========================= */
function scoreOutcome(trace) {
  const exec = trace.execution?.action;
  const priceMove = trace.inputs.price - trace.inputs.prev;

  if (exec === "BUY" && priceMove > 0) return 1;
  if (exec === "SELL" && priceMove < 0) return 1;
  if (exec === "HOLD") return 0.5;

  return 0;
}

/* =========================
   ADJUSTMENT LOGIC
========================= */
function computeAdjustment(trace, outcome) {
  const base = (outcome - 0.5) * 0.01;

  return {
    sophia: base * signalWeight(trace.signals?.sophia),
    regime: base * signalWeight(trace.signals?.regime),
    strategy: base * signalWeight(trace.signals?.strategy),
    risk: base * signalWeight(trace.signals?.risk),
    consensus: base
  };
}

function signalWeight(signal) {
  if (!signal) return 0.5;
  if (signal === "BUY" || signal === "SELL") return 1;
  return 0.2;
}

/* =========================
   NORMALIZATION
========================= */
function normalizeWeights() {
  const sum = Object.values(WEIGHTS).reduce((a, b) => a + b, 0);

  for (const k in WEIGHTS) {
    WEIGHTS[k] = WEIGHTS[k] / sum;
  }
}

/* =========================
   GET STATE
========================= */
export function getWeights() {
  return WEIGHTS;
}
