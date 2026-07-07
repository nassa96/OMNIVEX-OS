const LiquidityHubV1 = require("./core/liquidity/hub/liquidityHub.cjs");
const Binance = require("./core/liquidity/adapters/binanceAdapter.cjs");
const Coinbase = require("./core/liquidity/adapters/coinbaseAdapter.cjs");
const OnChain = require("./core/liquidity/adapters/onchainAdapter.cjs");

const hub = new LiquidityHubV1({
  binance: new Binance(),
  coinbase: new Coinbase(),
  ethereum: new OnChain("ethereum"),
  arbitrum: new OnChain("arbitrum"),
  tron: new OnChain("tron")
});

hub.start();
