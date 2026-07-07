const RiskGate = require("./core/risk/gate.cjs");
const ExecutionRouter = require("./core/execution/router.cjs");
const SaintKernel = require("./core/kernel/unified/saintKernel.cjs");
const BinanceWS = require("./core/market/adapters/binanceWS.cjs");

console.log("[BOOT] SAINT LIVE KERNEL (BINANCE WS)");

const riskGate = new RiskGate();
const executor = new ExecutionRouter();

const kernel = new SaintKernel({
  riskGate,
  executor
});

const feed = new BinanceWS("btcusdt");

feed.connect((market) => {

  const signal = "HOLD"; // replace later with SOPHIA / strategy engine

  const result = kernel.run(signal, market);

  console.log("[SAINT LIVE]", {
    price: market.price,
    regime: result.regime,
    status: result.status,
    aggression: result.aggression
  });
});
