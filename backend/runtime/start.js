"use strict";

import path from "path";
import { bootRegistry, validateGraph } from "../core/registry/registryLoader.js";
import wsStream from "../core/feeds/wsMarketStream.js";

async function boot() {
  console.log("[BOOT] SAINT_PRIMAL STARTING");

  const res = await bootRegistry(path.resolve("./core"));

  console.log("[BOOT] REGISTRY:", res.status);

  const validation = validateGraph();

  if (!validation.valid) {
    console.error("[BOOT FAIL]", validation.errors);
    process.exit(1);
  }

  const kernel = res.registry.kernel;

  kernel.injectRegistry(res.registry);

  wsStream.startStream();

  console.log("[BOOT] SYSTEM ONLINE");
}

boot().catch(err => {
  console.error("[BOOT CRASH]", err);
  process.exit(1);
});
