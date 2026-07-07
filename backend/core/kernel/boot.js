"use strict";

/**
 * OMNIVEX BOOT LOADER
 * Starts full autonomous runtime system
 */

const kernel = require("./runtimeKernel");

function start() {
  console.log("[BOOT] OMNIVEX SYSTEM INITIALIZING...");

  kernel.boot((tick) => {
    console.log("[TICK]", {
      cycle: tick.cycle,
      price: tick.market.price,
      action: tick.decision.action,
      pnl: tick.reward
    });
  });

  console.log("[BOOT] SYSTEM ONLINE");
}

start();
