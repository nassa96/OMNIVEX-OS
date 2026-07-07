const NodeManager = require("./core/cluster/nodes/clusterNodeManagerV85.cjs");
const Scheduler = require("./core/cluster/scheduler/clusterSchedulerV85.cjs");
const Kube = require("./core/cluster/kubernetes/kubeControlPlaneV85.cjs");

const Auth = require("./core/exchange/auth/exchangeAuthV86.cjs");
const Router = require("./core/exchange/routing/orderRouterV86.cjs");
const Executor = require("./core/exchange/orders/orderExecutorV86.cjs");

const Gateway = require("./core/production/gateway/apiGatewayV87.cjs");
const Secrets = require("./core/production/secrets/secretsManagerV87.cjs");
const TLS = require("./core/production/tls/tlsLayerV87.cjs");

console.log("[SAINT V87] FINAL PRODUCTION CLUSTER ONLINE");

// =====================================================
// INFRA
// =====================================================
const nodeManager = new NodeManager();
nodeManager.registerNode("node-1", { region: "us-east" });
nodeManager.registerNode("node-2", { region: "us-west" });

const scheduler = new Scheduler(nodeManager);
const kube = new Kube(scheduler);

// =====================================================
// SECURITY
// =====================================================
const secrets = new Secrets({
  key: "ENV_BINANCE_KEY_PLACEHOLDER"
});

const auth = new Auth(secrets);
const router = new Router();
const executor = new Executor();

const tls = new TLS();

// =====================================================
// GATEWAY
// =====================================================
const gateway = new Gateway();

gateway.register("/order", (order) => {

  const signed = auth.sign(order);
  const route = router.route(order);

  const secured = tls.encrypt(signed);

  const node = kube.dispatch({
    ...signed,
    venue: route
  });

  return executor.execute(node.task);
});

// =====================================================
// SIMULATION LOOP
// =====================================================
setInterval(() => {

  const order = {
    symbol: "BTCUSDT",
    side: Math.random() > 0.5 ? "BUY" : "SELL",
    risk: Math.random()
  };

  const result = gateway.request("/order", order);

  console.log("\n====================");
  console.log("[ORDER RESULT]", result);
  console.log("====================\n");

}, 4000);
