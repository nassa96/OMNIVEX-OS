/**
 * SWARM VOTING ENGINE
 * resolves agent conflict
 */

function vote(signals) {
  let buy = 0;
  let sell = 0;

  for (const s of signals) {
    if (s.signal === "BUY") buy += s.weight;
    if (s.signal === "SELL") sell += s.weight;
  }

  if (buy > sell) return { signal: "BUY", strength: buy };
  if (sell > buy) return { signal: "SELL", strength: sell };

  return { signal: "HOLD", strength: 0 };
}

module.exports = { vote };
