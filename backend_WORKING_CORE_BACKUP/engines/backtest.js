/**
 * BACKTEST ENGINE V1
 * Turns Chronicle memory into replayable performance timeline
 */

import { replayChronicle } from "./chronicle.js";

/* =========================
   FULL BACKTEST RUN
========================= */
export function runBacktest(filter = {}) {
  const data = replayChronicle();

  let equity = 0;
  const timeline = [];

  for (const event of data) {
    if (filter.symbol && event.data.symbol !== filter.symbol) continue;
    if (filter.regime && event.data.regime?.regime !== filter.regime) continue;
    if (filter.strategy && event.data.strategy?.type !== filter.strategy) continue;

    const e = event.data;

    const move = (e.price - e.prev) / e.prev;

    let pnl = 0;

    if (e.execution?.decision === "BUY") pnl = move;
    if (e.execution?.decision === "SELL") pnl = -move;
    if (e.execution?.decision === "HOLD") pnl = 0;

    equity += pnl;

    timeline.push({
      ts: e.ts,
      symbol: e.symbol,
      price: e.price,
      decision: e.execution?.decision,
      regime: e.regime?.regime,
      strategy: e.strategy?.type,
      pnl,
      equity
    });
  }

  return {
    totalEvents: timeline.length,
    finalEquity: equity,
    timeline
  };
}

/* =========================
   SUMMARY STATS
========================= */
export function backtestSummary(result) {
  const wins = result.timeline.filter(t => t.pnl > 0).length;
  const losses = result.timeline.filter(t => t.pnl < 0).length;

  return {
    winRate: wins / (wins + losses || 1),
    totalReturn: result.finalEquity,
    trades: result.timeline.length
  };
}
