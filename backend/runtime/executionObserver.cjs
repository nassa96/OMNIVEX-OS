const BinanceOrderFeed = require("../core/execution/feeds/binanceOrderFeed.cjs");
const CoinbaseOrderFeed = require("../core/execution/feeds/coinbaseOrderFeed.cjs");
const ExecutionReconciler = require("../core/execution/feeds/executionReconciler.cjs");
const OrderLifecycleEngine = require("../core/execution/lifecycle/orderLifecycleEngine.cjs");

/**
 * SAINT V15 — EXECUTION OBSERVER CORE
 * -----------------------------------
 * Real-time execution state intelligence loop
 */

class ExecutionObserver {

  constructor() {

    this.lifecycle = new OrderLifecycleEngine();
    this.reconciler = new ExecutionReconciler(this.lifecycle);

    this.binance = new BinanceOrderFeed();
    this.coinbase = new CoinbaseOrderFeed();
  }

  start(binanceListenKey) {

    console.log("[V15 EXECUTION OBSERVER] online");

    // BINANCE
    this.binance.connect(binanceListenKey, (update) => {
      this.reconciler.apply(update);
    });

    // COINBASE
    this.coinbase.connect((update) => {
      this.reconciler.apply(update);
    });
  }

  getOrderState(orderId) {
    return this.lifecycle.orders.get(orderId);
  }
}

module.exports = ExecutionObserver;
