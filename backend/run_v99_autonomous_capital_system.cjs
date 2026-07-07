const Reconciler = require("./core/execution/reconciliation/executionReconcilerV97.cjs");
const LedgerSync = require("./core/execution/ledger_sync/ledgerSyncV97.cjs");

const SmartRouter = require("./core/latency/router/smartRouterV98.cjs");
const Predictor = require("./core/latency/predictive/predictiveRouterV98.cjs");

const Lifecycle = require("./core/capital/lifecycle/capitalLifecycleV99.cjs");
const Rebalancer = require("./core/capital/rebalancing/rebalancerV99.cjs");
const Autonomy = require("./core/capital/autonomy/capitalAutonomyV99.cjs");

console.log("[SAINT V99] AUTONOMOUS CAPITAL SYSTEM ONLINE");

// =====================================================
// EXECUTION LAYER
// =====================================================
const reconciler = new Reconciler();
const ledger = new LedgerSync();

// =====================================================
// LATENCY LAYER
// =====================================================
const predictor = new Predictor();
const router = new SmartRouter(predictor);

const exchanges = [
  { name: "BINANCE_US" },
  { name: "COINBASE" }
];

// =====================================================
// CAPITAL LIFECYCLE
// =====================================================
const lifecycle = new Lifecycle();
const rebalancer = new Rebalancer();
const autonomy = new Autonomy(lifecycle, rebalancer);

// =====================================================
// LOOP
// =====================================================
setInterval(() => {

  const order = {
    symbol: "BTCUSDT",
    price: Math.random() * 100000,
    expectedPrice: Math.random() * 100000
  };

  const route = router.route(order, exchanges);

  const execution = {
    price: order.price + (Math.random() - 0.5) * 10,
    exchange: route.exchange
  };

  reconciler.log(order, execution);
  ledger.sync(order, execution);

  const pnl = Math.random() * 10 - 5;
  const state = autonomy.tick(pnl);

  console.log("\n====================");
  console.log("[ROUTE]", route);
  console.log("[EXECUTION]", execution);
  console.log("[CAPITAL STATE]", state);
  console.log("====================\n");

}, 4000);
