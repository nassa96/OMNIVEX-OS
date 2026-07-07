const RiskGate = require("./core/risk/gate.cjs");
const ExecutionRouter = require("./core/execution/router.cjs");
const SaintKernel = require("./core/kernel/unified/saintKernel.cjs");

const BinanceWS = require("./core/market/adapters/binanceWS.cjs");
const CoinbaseWS = require("./core/market/adapters/coinbaseWS.cjs");

console.log("[BOOT] SAINT LIQUIDITY BRAIN ONLINE");

const kernel = new SaintKernel({
  riskGate: new RiskGate(),
  executor: new ExecutionRouter()
});

const state = {
  binance: null,
  coinbase: null
};

const binance = new BinanceWS("btcusdt");
const coinbase = new CoinbaseWS("BTC-USD");

binance.connect((m) => state.binance = m);
coinbase.connect((m) => state.coinbase = m);

setInterval(() => {

  if (!state.binance || !state.coinbase) return;

  const mergedMarket = {
    ...state.binance,
    bids: [...state.binance.bids, ...state.coinbase.bids],
    asks: [...state.binance.asks, ...state.coinbase.asks]
  };

  const result = kernel.run(mergedMarket);

  console.log("[SAINT LIQUIDITY]", {
    status: result.status,
    regime: result.regime,
    aggression: result.aggression
  });

}, 1200);
