const RiskGate = require("./core/risk/gate.cjs");
const ExecutionRouter = require("./core/execution/router.cjs");
const SaintKernel = require("./core/kernel/unified/saintKernel.cjs");

console.log("[BOOT] SAINT UNIFIED KERNEL ONLINE");

const riskGate = new RiskGate();
const executor = new ExecutionRouter();

const kernel = new SaintKernel({
  riskGate,
  executor
});

// fake market loop (replace with WS later)
setInterval(() => {

  const market = {
    symbol: "BTC",
    price: 50000 + Math.random() * 1000,
    bids: Array.from({ length: Math.floor(Math.random() * 10) }),
    asks: Array.from({ length: Math.floor(Math.random() * 10) }),
    ts: Date.now()
  };

  const signal = "HOLD";

  const result = kernel.run(signal, market);

  console.log("[SAINT KERNEL]", result);

}, 1500);
