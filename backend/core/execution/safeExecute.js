"use strict";

import router from "./executionRouter.js";

/**
 * Execution Safety Wrapper
 * - ensures only validated trades reach exchanges
 */

export async function safeExecute(payload) {
  if (!payload?.risk?.approved) {
    return {
      status: "BLOCKED_BY_RISK",
      reason: payload?.risk?.reason || "UNKNOWN"
    };
  }

  const execution = await router.execute(payload);

  return {
    status: "EXECUTED",
    execution
  };
}

export default {
  safeExecute
};
