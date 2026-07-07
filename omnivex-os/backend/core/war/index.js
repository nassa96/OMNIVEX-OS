class WarEngine {
  constructor(forge) {
    this.forge = forge;
  }

  resolve(signals) {
    const grouped = {};

    for (const s of signals) {
      if (!grouped[s.symbol]) grouped[s.symbol] = [];
      grouped[s.symbol].push(s);
    }

    const resolved = [];

    for (const symbol in grouped) {
      const group = grouped[symbol];

      // separate philosophies
      const tartarus = group.filter(g => g.agent === "TARTARUS");
      const cerberus = group.filter(g => g.agent === "CERBERUS");
      const elohim = group.filter(g => g.agent === "ELOHIM");

      const pickBest = (arr, bias = 1) => {
        if (!arr.length) return null;

        return arr.reduce((a, b) =>
          (a.score * bias) > (b.score * bias) ? a : b
        );
      };

      const tPick = pickBest(tartarus, 1.2);
      const cPick = pickBest(cerberus, 1.1);
      const ePick = pickBest(elohim, 1.3);

      const candidates = [tPick, cPick, ePick].filter(Boolean);

      const winner = candidates.reduce((a, b) =>
        a.score > b.score ? a : b
      );

      this.forge.update(winner.agent, winner.score * 10);

      resolved.push({
        symbol,
        controller: winner.agent,
        score: winner.score,
        signal: winner.signal
      });
    }

    return resolved;
  }
}

module.exports = WarEngine;
