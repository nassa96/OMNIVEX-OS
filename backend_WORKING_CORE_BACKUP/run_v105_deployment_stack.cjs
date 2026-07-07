const Testnet = require("./core/deployment/testnet/testnetGatewayV103.cjs");
const Sandbox = require("./core/deployment/sandbox/sandboxExecutionV103.cjs");
const Health = require("./core/deployment/healthcheck/healthCheckV103.cjs");

const FillEngine = require("./core/execution/fill_engine/fillEngineV104.cjs");
const Replay = require("./core/execution/replay/executionReplayV104.cjs");
const Recon = require("./core/execution/reconciliation_v2/reconciliationV104.cjs");

const Distributor = require("./core/capital/distribution/capitalDistributorV105.cjs");
const Multi = require("./core/capital/multi_account/multiAccountManagerV105.cjs");
const Ledger = require("./core/capital/ledger_v2/capitalLedgerV105.cjs");

console.log("[SAINT V105] DEPLOYMENT STACK ONLINE");

// =====================================================
// DEPLOYMENT LAYER
// =====================================================
const testnet = new Testnet({ enabled: true });
const sandbox = new Sandbox();
const health = new Health();

// =====================================================
// EXECUTION LAYER
// =====================================================
const fill = new FillEngine();
const replay = new Replay();
const recon = new Recon();

// =====================================================
// CAPITAL LAYER
// =====================================================
const distributor = new Distributor();
const multi = new Multi(distributor);
const ledger = new Ledger();

// =====================================================
// LOOP
// =====================================================
setInterval(() => {

  const order = {
    id: "ORD-" + Date.now(),
    price: Math.random() * 1000,
    size: Math.random() * 0.2
  };

  const healthState = {
    errorRate: Math.random() * 0.2,
    latency: Math.random() * 300
  };

  const h = health.check(healthState);

  const test = testnet.route(order);
  const sim = sandbox.execute(order);
  const fillEvent = fill.generateFill(order);

  replay.record(fillEvent);

  const reconciliation = recon.compare(order, fillEvent);

  const allocation = multi.allocate(1000);

  ledger.record({
    order,
    fillEvent,
    reconciliation,
    allocation
  });

  console.log("\n====================");
  console.log("[HEALTH]", h);
  console.log("[TESTNET]", test);
  console.log("[SANDBOX]", sim);
  console.log("[FILL]", fillEvent);
  console.log("[RECON]", reconciliation);
  console.log("[ALLOCATION]", allocation);
  console.log("====================\n");

}, 4000);
