const Sophia = require("../core/engine/sophia.cjs");
const OrderbookFeed = require("../core/orderbook/feed.cjs");
const RiskGate = require("../core/risk/gate.cjs");
const ExecutionRouter = require("../core/execution/router.cjs");
const ChronicleMemory = require("../core/chronicle/memory.cjs");
const RegimeEngine = require("../core/market/regimeEngine.cjs");

class CanonicalLoop {
  constructor() {
    this.memory = new ChronicleMemory();

    this.sophia = new Sophia(this.memory);
    this.feed = new OrderbookFeed();
    this.risk = new RiskGate();
    this.exec = new ExecutionRouter();
    this.regimeEngine = new RegimeEngine();

    this.state = {
      lastSignal: null,
      lastExecution: null,
      lastRegime: null
    };
  }

  start() {
    console.log("[SAINT V18] Regime detection loop starting...");

    this.feed.connect((market) => {

      const orderbook = market.orderbook || {};

      // ---------------------------
      // NEW: REGIME ANALYSIS
      // ---------------------------
      const regime = this.regimeEngine.analyze(market, orderbook);

      // Pass regime context into SOPHIA
      const analysis = this.sophia.analyze({
        ...market,
        regime: regime.regime
      });

      // ---------------------------
      // RISK FILTER ENHANCED BY REGIME
      // ---------------------------
      let riskDecision = this.risk.evaluate(analysis, market);

      if (regime.regime === "HIGH_VOLATILITY") {
        riskDecision = "BLOCK";
      }

      if (regime.regime === "LOW_LIQUIDITY") {
        riskDecision = "BLOCK";
      }

      const execution = this.exec.execute(riskDecision, market);

      // ---------------------------
      // MEMORY WRITE
      // ---------------------------
      this.memory.write({
        type: "tick",
        market,
        regime,
        analysis,
        riskDecision,
        execution
      });

      this.state.lastRegime = regime;
      this.state.lastSignal = analysis;
      this.state.lastExecution = execution;

      console.log("[V18 LOOP]", {
        price: market.price,
        regime: regime.regime,
        volatility: regime.volatility.toFixed(3),
        liquidity: regime.liquidity.toFixed(3),
        trend: regime.trend.toFixed(3),
        signal: analysis.signal,
        riskDecision,
        execution: execution.status
      });
    });
  }
}

module.exports = CanonicalLoop;
