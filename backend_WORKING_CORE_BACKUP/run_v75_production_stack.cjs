const CIPipeline = require("./core/ci/pipelineV75.cjs");
const Deployment = require("./core/cd/deploymentV75.cjs");
const Docker = require("./core/production/docker/dockerStackV75.cjs");

console.log("[SAINT V75] FULL PRODUCTION STACK INITIALIZING");

const ci = new CIPipeline();
const cd = new Deployment();
const docker = new Docker();

// =====================================================
// SYSTEM BOOT LOOP
// =====================================================
setInterval(() => {

  const build = ci.run();
  const deploy = cd.deploy("production");
  const stack = docker.generate();

  console.log("\n====================");
  console.log("CI:", build);
  console.log("CD:", deploy);
  console.log("DOCKER STACK READY:\n", stack);
  console.log("====================\n");

}, 5000);
