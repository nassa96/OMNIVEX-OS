"use strict";

import crypto from "crypto";
import CONFIG from "../config.js";

export async function execute({ decision, market }) {
  if (!CONFIG.live) {
    return {
      venue: "HYPERLIQUID",
      status: "SAFE_MODE"
    };
  }

  const hash = crypto
    .createHash("sha256")
    .update(JSON.stringify({ decision, market }))
    .digest("hex");

  return {
    venue: "HYPERLIQUID",
    orderHash: hash,
    status: "LIVE_PENDING_FILL"
  };
}

export default { execute };
