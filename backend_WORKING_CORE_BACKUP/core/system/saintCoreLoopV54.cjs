/**
 * SAINT V54 — NOW WITH V57 ORDERFLOW INTELLIGENCE
 */

class SaintCoreLoopV54 {

  constructor({
    mercury,
    orderflowEngine,
    signalEngine,
    riskGovernor,
    executionEngine,
    positionEngine,
    circuitBreaker
  }) {

    this.mercury = mercury;
    this.orderflowEngine = orderflowEngine;
    this.signalEngine = signalEngine;
    this.riskGovernor = riskGovernor;
    this.executionEngine = executionEngine;
    this.positionEngine = positionEngine;
    this.circuitBreaker = circuitBreaker;
  }

  async tick() {

    const market = this.mercury.snapshot("ETH-USD");

    // =====================================================
    // 1. CIRCUIT BREAKER
    // =====================================================
    const safety = this.circuitBreaker.evaluate(market, this.positionEngine);

    if (safety.halted) {
      return { status: "HALTED", safety };
    }

    // =====================================================
    // 2. ORDERFLOW INTELLIGENCE (V57)
    // =====================================================
    const flow = this.orderflowEngine.analyze(market);

    // =====================================================
    // 3. SIGNAL ENGINE (now flow-aware)
    // =====================================================
    const signal = this.signalEngine.generate({
      ...market,
      flow
    });

    // =====================================================
    // 4. UNIFIED RISK GOVERNOR (V56)
    // =====================================================
    const risk = this.riskGovernor.evaluate(
      market,
      signal,
      this.positionEngine
    );

    if (risk.decision !== "ALLOW") {
      return {
        status: risk.decision,
        risk,
        flow
      };
    }

    // =====================================================
    // 5. EXECUTION
    // =====================================================
    const execution = await this.executionEngine.execute(signal);

    if (execution?.data?.fills?.length) {
      const fillPrice = execution.data.fills[0].price;
      this.positionEngine.open(signal, fillPrice);
    }

    this.positionEngine.updatePrice(
      "ETH-USD",
      market.price
    );

    return {
      status: "ACTIVE",
      market,
      flow,
      signal,
      risk,
      safety,
      positions: this.positionEngine.snapshot()
    };
  }
}

module.exports = SaintCoreLoopV54;
