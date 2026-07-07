import fetch from "node-fetch";

const MODE = process.env.MODE || "PAPER";

/**
 * EXECUTION LAYER
 * PAPER or LIVE routing
 */

export async function placeOrder({ symbol, side, size, price }) {
  if (MODE === "PAPER") {
    return paperOrder({ symbol, side, size, price });
  }

  return liveOrder({ symbol, side, size });
}

/**
 * SIMULATED EXECUTION
 */
function paperOrder(order) {
  return {
    ...order,
    status: "FILLED",
    fillPrice: order.price,
    mode: "PAPER",
    timestamp: Date.now()
  };
}

/**
 * LIVE EXCHANGE EXECUTION (PLACEHOLDER WIRED)
 * You will plug Coinbase/Binance/Kraken here
 */
async function liveOrder(order) {
  // SAFETY DEFAULT
  throw new Error("LIVE MODE NOT YET ENABLED SAFELY");

  // Example structure (DO NOT ENABLE UNTIL KEYED):
  /*
  const res = await fetch("https://api.exchange.com/orders", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.EXCHANGE_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(order)
  });

  return await res.json();
  */
}
