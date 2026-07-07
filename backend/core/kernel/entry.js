"use strict";

import runtimeKernel from "./runtimeKernel.js";
import registry from "../registry/canonicalRegistry.js";

/**
 * SINGLE ENTRY POINT
 * Nothing executes outside this file
 */

export async function onMarketTick(market) {
  const kernel = runtimeKernel;

  return await kernel.runtimeTick(market);
}

export default {
  onMarketTick,
  registry
};
