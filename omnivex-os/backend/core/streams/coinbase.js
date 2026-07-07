/**
 * STREAMCORE - COINBASE FEED v2
 * -----------------------------
 * PURPOSE:
 * - ingest market data only
 * - normalize tick stream
 * - forward to AURIN kernel
 *
 * IMPORTANT:
 * - NO trading logic here
 * - NO execution imports here
 */

import WebSocket from "ws"
import { runKernel } from "../aurin/kernel.js"

let prices = {}
let reconnectAttempts = 0

function normalizeTick(raw) {
  return {
    symbol: raw.product_id,
    price: Number(raw.price),
    time: Date.now()
  }
}

/* =========================
   STREAM CONNECTION
========================= */

function connect() {
  const ws = new WebSocket("wss://ws-feed.exchange.coinbase.com")

  ws.on("open", () => {
    console.log("🟢 STREAMCORE CONNECTED (COINBASE)")
    reconnectAttempts = 0

    ws.send(JSON.stringify({
      type: "subscribe",
      product_ids: ["BTC-USD", "ETH-USD", "SOL-USD"],
      channels: ["ticker"]
    }))
  })

  ws.on("message", (raw) => {
    try {
      const msg = JSON.parse(raw.toString())

      if (msg.type === "ticker" && msg.price) {
        const tick = normalizeTick(msg)

        prices[tick.symbol] = tick.price

        /* =========================
           HAND OFF TO AURIN
        ========================= */

        runKernel(tick.symbol, tick.price, {
          source: "COINBASE",
          time: tick.time
        })
      }

    } catch (err) {
      // silent fail for stream resilience
    }
  })

  ws.on("close", () => {
    console.log("🔴 STREAMCORE DISCONNECTED")

    const delay = Math.min(1000 * 2 ** reconnectAttempts, 15000)
    reconnectAttempts++

    setTimeout(connect, delay)
  })

  ws.on("error", (err) => {
    console.log("STREAMCORE ERROR:", err.message)
  })
}

/* =========================
   PUBLIC API
========================= */

export function getLatestPrice(symbol = "BTC-USD") {
  return prices[symbol] || 0
}

/* =========================
   BOOT
========================= */

connect()
