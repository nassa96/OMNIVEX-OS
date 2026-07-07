import WebSocket from "ws"

/*
  OMNIVEX STREAMCORE v1
  - Multi-asset Coinbase WebSocket ingestion
  - Normalized price store
  - Shared memory via getPrices()
*/

const prices = {
  "BTC-USD": 0,
  "ETH-USD": 0,
  "SOL-USD": 0
}

let ws = null
let reconnectAttempts = 0

export function getPrices() {
  return prices
}

/* ---------------- SUBSCRIBE ---------------- */

function subscribe(socket) {
  socket.send(JSON.stringify({
    type: "subscribe",
    product_ids: Object.keys(prices),
    channels: ["ticker"]
  }))
}

/* ---------------- CONNECT ---------------- */

function connect() {
  ws = new WebSocket("wss://ws-feed.exchange.coinbase.com")

  ws.on("open", () => {
    reconnectAttempts = 0
    console.log("🟢 STREAMCORE CONNECTED (COINBASE)")

    subscribe(ws)
  })

  ws.on("message", (raw) => {
    try {
      const msg = JSON.parse(raw.toString())

      if (msg.type === "ticker" && msg.product_id) {
        const price = Number(msg.price)

        if (!isNaN(price)) {
          prices[msg.product_id] = price
        }
      }
    } catch (err) {
      // silent fail (stream resilience)
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

/* ---------------- BOOT ---------------- */

connect()
