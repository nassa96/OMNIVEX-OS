const CapitalGovernor = require("./core/capital/governor/capitalGovernorV91.cjs");
const PositionLimit = require("./core/capital/limits/positionLimitV91.cjs");
const Ledger = require("./core/capital/ledger/capitalLedgerV91.cjs");

const RiskPolicy = require("./core/compliance/rules/riskPolicyV92.cjs");
const Audit = require("./core/compliance/audit/auditEngineV92.cjs");
const ComplianceGate = require("./core/compliance/risk/complianceGateV92.cjs");

const KillSwitch = require("./core/governance/kill_switch/killSwitchV93.cjs");
const Policy = require("./core/governance/policy/governancePolicyV93.cjs");
const Governor = require("./core/governance/approvals/institutionalGovernorV93.cjs");

console.log("[SAINT V93] INSTITUTIONAL GOVERNOR ONLINE");

// =====================================================
// CAPITAL LAYER
// =====================================================
const capital = new CapitalGovernor({
  maxDailyLoss: 150,
  maxPositionSize: 0.1
});

const ledger = new Ledger();
const positionLimit = new PositionLimit();

// =====================================================
// COMPLIANCE LAYER
// =====================================================
const policy = new RiskPolicy();
const audit = new Audit();
const compliance = new ComplianceGate(policy, audit);

// =====================================================
// GOVERNANCE LAYER
// =====================================================
const killSwitch = new KillSwitch();
const govPolicy = new Policy();

const governor = new Governor({
  capitalGovernor: capital,
  complianceGate: compliance,
  governancePolicy: govPolicy,
  killSwitch
});

// =====================================================
// SIMULATION LOOP
// =====================================================
setInterval(() => {

  const order = {
    symbol: "BTCUSDT",
    size: Math.random() * 0.2,
    risk: Math.random(),
    exposure: Math.random() * 0.4
  };

  const decision = governor.approve(order);

  console.log("\n====================");
  console.log("[ORDER]", order);
  console.log("[DECISION]", decision);
  console.log("[CAPITAL]", capital.status());
  console.log("====================\n");

}, 4000);
