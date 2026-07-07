import WebSocket from "ws";

const BINANCE_WS = "wss://stream.binance.com:9443/ws/btcusdt@depth@100ms";

let book = {
  bids: new Map(),
  asks: new Map(),
  lastUpdateId: null
};

let subscribers = [];

function subscribe(handler) {
  subscribers.push(handler);
}

function emit() {
  const snapshot = {
    bids: Array.from(book.bids.entries())
      .sort((a, b) => b[0] - a[0])
      .slice(0, 20)
      .map(([price, size]) => ({ price: Number(price), size })),

    asks: Array.from(book.asks.entries())
      .sort((a, b) => a[0] - b[0])
      .slice(0, 20)
      .map(([price, size]) => ({ price: Number(price), size })),

    timestamp: Date.now()
  };

  subscribers.forEach(fn => fn(snapshot));
}

function connect() {
  const ws = new WebSocket(BINANCE_WS);

  ws.on("open", () => {
    console.log("[ORDERBOOK WS] Connected to Binance depth stream");
  });

  ws.on("message", (data) => {
    const msg = JSON.parse(data);

    const bids = msg.b || [];
    const asks = msg.a || [];

    for (const [price, size] of bids) {
      if (Number(size) === 0) {
        book.bids.delete(price);
      } else {
        book.bids.set(price, Number(size));
      }
    }

    for (const [price, size] of asks) {
      if (Number(size) === 0) {
        book.asks.delete(price);
      } else {
        book.asks.set(price, Number(size));
      }
    }

    book.lastUpdateId = msg.u;

    emit();
  });

  ws.on("close", () => {
    console.log("[ORDERBOOK WS] Disconnected, retrying in 2s...");
    setTimeout(connect, 2000);
  });

  ws.on("error", (err) => {
    console.log("[ORDERBOOK WS ERROR]", err.message);
  });

  return ws;
}

function getBook() {
  return {
    bids: Array.from(book.bids.entries()),
    asks: Array.from(book.asks.entries()),
    lastUpdateId: book.lastUpdateId
  };
}

export {
  connect,
  subscribe,
  getBook
};
