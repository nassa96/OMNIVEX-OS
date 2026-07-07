"use strict";

import jwt from "jsonwebtoken";
import CONFIG from "../config.js";

const BASE = "https://api.coinbase.com";

function sign() {
  const payload = {
    iss: CONFIG.coinbase.key,
    exp: Math.floor(Date.now() / 1000) + 120,
    uri: "/api/v3/brokerage/orders"
  };

  return jwt.sign(payload, CONFIG.coinbase.secret, {
    algorithm: "HS256"
  });
}

export async function execute({ decision }) {
  if (!CONFIG.live) {
    return {
      venue: "COINBASE",
      status: "SAFE_MODE"
    };
  }

  const token = sign();

  const res = await fetch(BASE + "/api/v3/brokerage/orders", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      product_id: "BTC-USD",
      side: decision.action,
      order_type: "market"
    })
  });

  const data = await res.json();

  return {
    venue: "COINBASE",
    raw: data,
    status: "LIVE"
  };
}

export default { execute };
