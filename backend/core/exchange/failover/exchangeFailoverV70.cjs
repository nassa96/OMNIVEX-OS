/**
 * SAINT V70 — FAILOVER ENGINE
 * Ensures trade execution resilience
 */

class ExchangeFailoverV70 {

  constructor(backupExchange) {
    this.backup = backupExchange;
  }

  async execute(primaryFn, order) {

    try {
      return await primaryFn(order);
    } catch (err) {
      console.log("[V70] Failover triggered");
      return await this.backup.execute(order);
    }
  }
}

module.exports = ExchangeFailoverV70;
