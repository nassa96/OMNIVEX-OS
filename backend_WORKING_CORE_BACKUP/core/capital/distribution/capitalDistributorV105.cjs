/**
 * SAINT V105 — CAPITAL DISTRIBUTION ENGINE
 */

class CapitalDistributorV105 {

  distribute(totalCapital) {

    return {
      accountA: totalCapital * 0.4,
      accountB: totalCapital * 0.35,
      accountC: totalCapital * 0.25
    };
  }
}

module.exports = CapitalDistributorV105;
