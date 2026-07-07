"use strict";

import crypto from "crypto";
import CONFIG from "../config.js";

const BASE = "https://api.binance.us";

function sign(query, secret) {
  return crypto.createHmac("sha256", secret).update(query).digest("hex");
}

export async function execute({ decision, market }) {
  if (!CONFIG.live) {
    return {
      venue: "BINANCE_US",
      status: "SAFE_MODE",
      side: decision?.action,
      price: market?.price
    };
  }

  const timestamp = Date.now();

  const query = `symbol=BTCUSDT&side=${decision.action}&type=MARKET&timestamp=${timestamp}`;
  const signature = sign(query, CONFIG.binance.secret);

  const res = await fetch(
    `${BASE}/api/v3/order?${query}&signature=${signature}`,
    {
      method: "POST",
      headers: {
        "X-MBX-APIKEY": CONFIG.binance.key
      }
    }
  );

  const data = await res.json();

  return {
    venue: "BINANCE_US",
    raw: data,
    status: "LIVE"
  };
}

export default { execute };
