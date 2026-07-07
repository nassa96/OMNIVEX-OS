/**
 * ATLAS AGENT COMPETITION ENGINE V1
 * Scores internal decision systems against each other
 */

const STATE = {
  BTC: [],
  ETH: [],
  SOL: []
};

/* =========================
   SCORE ENTRY
========================= */
export function scoreCompetition(symbol, payload) {
  const {
    sophiaSignal,
    regimeSignal,
    strategySignal,
    riskSignal,
    executionDecision,
    priceChange
  } = payload;

  const score = {
    sophia: scoreSignal(sophiaSignal, priceChange),
    regime: scoreSignal(regimeSignal, priceChange),
    strategy: scoreSignal(strategySignal, priceChange),
    risk: scoreRisk(riskSignal),
    execution: scoreExecution(executionDecision, priceChange)
  };

  const total =
    score.sophia +
    score.regime +
    score.strategy +
    score.risk +
    score.execution;

  const result = {
    ...score,
    total,
    winner: pickWinner(score)
  };

  STATE[symbol].push(result);

  if (STATE[symbol].length > 2000) {
    STATE[symbol].shift();
  }

  return result;
}

/* =========================
   SCORING FUNCTIONS
========================= */

function scoreSignal(signal, priceChange) {
  if (!signal) return 0;
  if (signal === "BUY" && priceChange > 0) return 1;
  if (signal === "SELL" && priceChange < 0) return 1;
  return 0.2;
}

function scoreRisk(risk) {
  if (!risk) return 0;
  if (risk === "LOW") return 1;
  if (risk === "MEDIUM") return 0.5;
  return 0.1;
}

function scoreExecution(decision, priceChange) {
  if (!decision) return 0;
  if (decision === "BUY" && priceChange > 0) return 1;
  if (decision === "SELL" && priceChange < 0) return 1;
  if (decision === "HOLD") return 0.4;
  return 0.2;
}

function pickWinner(score) {
  return Object.entries(score).reduce((a, b) =>
    a[1] > b[1] ? a : b
  )[0];
}

/* =========================
   GET HISTORY
========================= */
export function getCompetition(symbol) {
  return STATE[symbol] || [];
}
