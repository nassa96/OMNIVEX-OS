/**
 * FORGE v1 - Evolution Layer
 */

function evolveFromReplay(ledger) {
  let buy = 0, sell = 0;

  for (const e of ledger || []) {
    if (e.signal?.signal === "BUY") buy++;
    if (e.signal?.signal === "SELL") sell++;
  }

  const mutation = {
    buyBias: buy / (ledger.length || 1),
    sellBias: sell / (ledger.length || 1),
    regime: buy > sell ? "BULL" : "BEAR"
  };

  const stats = {
    size: ledger.length || 0
  };

  return {
    system: "FORGE_V1",
    mutation,
    ledgerStats: stats
  };
}

module.exports = {
  evolveFromReplay
};
