/**
 * OMNIVEX FORGE — SCORING ENGINE
 */

export function scoreStrategy(events = []) {
  if (!events.length) return { score: 0 };

  let pnlSum = 0;
  let trades = 0;

  for (const e of events) {
    if (typeof e.pnl === "number") {
      pnlSum += e.pnl;
      trades++;
    }
  }

  const avgPnl = trades ? pnlSum / trades : 0;

  return {
    trades,
    avgPnl,
    score: avgPnl * Math.log(trades + 1)
  };
}
