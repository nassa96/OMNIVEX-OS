const RiskGate = require("./core/risk/gate.cjs");
const ExecutionRouter = require("./core/execution/router.cjs");
const SaintKernel = require("./core/kernel/unified/saintKernel.cjs");

const BinanceWS = require("./core/market/adapters/binanceWS.cjs");
const CoinbaseWS = require("./core/market/adapters/coinbaseWS.cjs");

console.log("[BOOT] SAINT MULTI-LIQUIDITY KERNEL");

const riskGate = new RiskGate();
const executor = new ExecutionRouter();

const kernel = new SaintKernel({
  riskGate,
  executor
});

// -----------------------------
// SHARED MARKET AGGREGATION
// -----------------------------
const state = {
  binance: null,
  coinbase: null
};

function mergeMarket() {
  if (!state.binance || !state.coinbase) return null;

  const price =
    (state.binance.price + state.coinbase.price) / 2;

  const bids = [...(state.binance.bids || []), ...(state.coinbase.bids || [])];
  const asks = [...(state.binance.asks || []), ...(state.coinbase.asks || [])];

  return {
    symbol: "BTC-MULTI",
    price,
    bids,
    asks,
    ts: Date.now()
  };
}

// -----------------------------
// FEEDS
// -----------------------------
const binance = new BinanceWS("btcusdt");
const coinbase = new CoinbaseWS("BTC-USD");

binance.connect((m) => state.binance = m);
coinbase.connect((m) => state.coinbase = m);

// -----------------------------
// KERNEL LOOP
// -----------------------------
setInterval(() => {

  const market = mergeMarket();
  if (!market) return;

  const signal = "HOLD"; // later SOPHIA replaces this

  const result = kernel.run(signal, market);

  console.log("[SAINT MULTI]", {
    price: market.price,
    regime: result.regime,
    status: result.status,
    aggression: result.aggression
  });

}, 1200);
