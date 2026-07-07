const BinanceWS = require("./core/market/adapters/binanceWS.cjs");
const CoinbaseWS = require("./core/market/adapters/coinbaseWS.cjs");
const KrakenWS = require("./core/market/adapters/krakenWS.cjs");

const RiskGate = require("./core/risk/gate.cjs");
const ExecutionRouter = require("./core/execution/router.cjs");
const SaintKernel = require("./core/kernel/unified/saintKernel.cjs");

const kernel = new SaintKernel({
  riskGate: new RiskGate(),
  executor: new ExecutionRouter()
});

const hub = kernel.hub;

const binance = new BinanceWS("btcusdt");
const coinbase = new CoinbaseWS("BTC-USD");
const kraken = new KrakenWS("XBT/USD");

binance.connect(m => hub.update("binance", m));
coinbase.connect(m => hub.update("coinbase", m));
kraken.connect(m => hub.update("kraken", m));

setInterval(async () => {

  const result = kernel.run();

  console.log("[LIQUIDITY HUB V1]", {
    status: result.status,
    regime: result.regime
  });

}, 1200);
