"use strict";

import crypto from "crypto";
import CONFIG from "../config.js";

const BASE = "https://api.kraken.com";

function sign(path, nonce, postdata, secret) {
  const message = nonce + postdata;
  return crypto
    .createHmac("sha512", Buffer.from(secret, "base64"))
    .update(message)
    .digest("base64");
}

export async function execute({ decision, market }) {
  if (!CONFIG.live) {
    return {
      venue: "KRAKEN",
      status: "SAFE_MODE"
    };
  }

  const nonce = Date.now().toString();
  const body = `nonce=${nonce}&ordertype=market&type=${decision.action}&volume=0`;

  const signature = sign(
    "/0/private/AddOrder",
    nonce,
    body,
    CONFIG.kraken.secret
  );

  const res = await fetch(BASE + "/0/private/AddOrder", {
    method: "POST",
    headers: {
      "API-Key": CONFIG.kraken.key,
      "API-Sign": signature,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });

  const data = await res.json();

  return {
    venue: "KRAKEN",
    raw: data,
    status: "LIVE"
  };
}

export default { execute };
