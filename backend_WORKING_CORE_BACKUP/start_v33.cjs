const MarketRegistry = require("./core/market/isolation/marketRegistry.cjs");

const BinanceWS = require("./core/market/adapters/binanceWS.cjs");
const CoinbaseWS = require("./core/market/adapters/coinbaseWS.cjs");
const KrakenWS = require("./core/market/adapters/krakenWS.cjs");

const SaintKernel = require("./core/kernel/unified/saintKernel.cjs");
const RiskGate = require("./core/risk/gate.cjs");
const ExecutionRouter = require("./core/execution/router.cjs");

const registry = new MarketRegistry();

// ---------------------------
// KERNEL
// ---------------------------
const kernel = new SaintKernel({
  riskGate: new RiskGate(),
  executor: new ExecutionRouter()
});

// ---------------------------
// BINANCE STREAM
// ---------------------------
const binance = new BinanceWS("btcusdt");

binance.connect((data) => {
  registry.books.binance.update(data);
});

// ---------------------------
// COINBASE STREAM
// ---------------------------
const coinbase = new CoinbaseWS("BTC-USD");

coinbase.connect((data) => {
  registry.books.coinbase.update(data);
});

// ---------------------------
// KRAKEN STREAM
// ---------------------------
const kraken = new KrakenWS("XBT/USD");

kraken.connect((data) => {
  registry.books.kraken.update(data);
});

// ---------------------------
// KERNEL LOOP
// ---------------------------
console.log("[SAINT V33] LIVE MULTI-EXCHANGE SYSTEM STARTED");

setInterval(() => {

  const result = kernel.run(registry);

  console.log("[V33 EXEC]", {
    status: result.status,
    venue: result.venue,
    regime: result.regime,
    divergence: result.divergence
  });

}, 1200);
