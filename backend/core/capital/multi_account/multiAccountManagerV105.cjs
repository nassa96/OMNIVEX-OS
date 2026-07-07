/**
 * SAINT V105 — MULTI ACCOUNT MANAGER
 */

class MultiAccountManagerV105 {

  constructor(distributor) {
    this.distributor = distributor;
  }

  allocate(capital) {

    return this.distributor.distribute(capital);
  }
}

module.exports = MultiAccountManagerV105;
