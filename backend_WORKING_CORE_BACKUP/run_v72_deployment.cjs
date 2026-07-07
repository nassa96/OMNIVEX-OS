const EnvAggregator = require("./core/security/env/envAggregatorV71.cjs");
const KeyVault = require("./core/security/vault/keyVaultV71.cjs");

const Cloud = require("./core/deployment/cloud/cloudOrchestratorV72.cjs");
const Docker = require("./core/deployment/docker/dockerRuntimeV72.cjs");

console.log("[SAINT V72] DEPLOYMENT SYSTEM ONLINE");

// =====================================================
// ENV + VAULT INIT
// =====================================================
const envAgg = new EnvAggregator([
  process.env.HOME + "/SAINT_PRIMAL/backend/.env",
  process.env.HOME + "/SAINT_PRIMAL/.env",
  process.env.HOME + "/.env"
]);

const env = envAgg.load();
const vault = new KeyVault(env);

// =====================================================
// CLOUD + DOCKER
// =====================================================
const cloud = new Cloud();
const docker = new Docker();

// =====================================================
// SIMULATION DEPLOY
// =====================================================
setInterval(() => {

  const load = Math.random();

  const infra = cloud.deploy(load);

  console.log("\n====================");
  console.log("INFRA STATE:", infra);
  console.log("BINANCE KEY EXISTS:", vault.has("BINANCE_API_KEY"));
  console.log("DOCKER CONFIG READY:\n", docker.generateConfig());
  console.log("====================\n");

}, 4000);
