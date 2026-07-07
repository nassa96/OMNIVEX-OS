const bus = require("../../core/events/bus.cjs");

const BinanceAdapter = require("../../core/market/adapters/binance.cjs");
const CoinbaseAdapter = require("../../core/market/adapters/coinbase.cjs");

const UnifiedLiquidityBrain = require("../../core/market/liquidity/unifiedLiquidityBrain.cjs");

class LiquidityKernel {
  start() {
    console.log("[SAINT] Liquidity Kernel starting...");

    const brain = new UnifiedLiquidityBrain(bus);

    const binance = new BinanceAdapter(bus);
    const coinbase = new CoinbaseAdapter(bus);

    binance.connect();
    coinbase.connect();

    bus.on("liquidity:update", (state) => {
      console.log("[LIQUIDITY BRAIN]", state);
    });

    this.brain = brain;
  }
}

module.exports = LiquidityKernel;
