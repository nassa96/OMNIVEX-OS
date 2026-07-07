const ExchangeAuth = require("./core/exchange/auth/exchangeAuthV100.cjs");
const LiveExecutor = require("./core/exchange/execution/live_orders/liveOrderExecutorV100.cjs");

const Vault = require("./core/security/vault/securityVaultV101.cjs");
const Signing = require("./core/security/signing/signingEngineV101.cjs");

const ComplianceReporter = require("./core/compliance/reporting/complianceReporterV101.cjs");

const FundGovernor = require("./core/fund/governor/fundGovernorV102.cjs");
const FundRuntime = require("./core/fund/runtime/fundRuntimeV102.cjs");

console.log("[SAINT V102] AUTONOMOUS FUND CORE ONLINE");

// =====================================================
// SECURITY + AUTH
// =====================================================
const vault = new Vault();
vault.set("BINANCE_KEY", process.env.BINANCE_KEY || "MISSING");

const auth = new ExchangeAuth({
  apiKey: vault.get("BINANCE_KEY"),
  apiSecret: process.env.BINANCE_SECRET
});

const executor = new LiveExecutor(auth);

// =====================================================
// COMPLIANCE
// =====================================================
const compliance = new ComplianceReporter();

// =====================================================
// FUND GOVERNOR
// =====================================================
const governor = new FundGovernor({
  capital: { locked: false },
  compliance,
  execution: executor
});

const runtime = new FundRuntime(governor, executor);

// =====================================================
// LOOP
// =====================================================
setInterval(async () => {

  const order = {
    symbol: "BTCUSDT",
    risk: Math.random(),
    size: Math.random() * 0.1
  };

  const result = await runtime.tick(order);

  compliance.record({
    order,
    result
  });

  console.log("\n====================");
  console.log("[ORDER]", order);
  console.log("[RESULT]", result);
  console.log("====================\n");

}, 5000);
