const ws = new WebSocket("ws://localhost:3000");

let state = {
  trades: 0,
  blocked: 0,
  pnl: 0,
  lastPrice: 0,
  lastSignal: "HOLD",
  lastConfidence: 0
};

/* ============================================================
   CONNECTION STATUS
============================================================ */

ws.onopen = () => {
  document.getElementById("status").innerText = "LIVE WS CONNECTED";
};

ws.onclose = () => {
  document.getElementById("status").innerText = "DISCONNECTED";
};

ws.onerror = () => {
  document.getElementById("status").innerText = "WS ERROR";
};

/* ============================================================
   MESSAGE HANDLER
============================================================ */

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);

  switch (msg.type) {

    case "TICK":
      handleTick(msg);
      break;

    case "TRADE":
      handleTrade(msg);
      break;

    case "BLOCK":
      handleBlock(msg);
      break;
  }
};

/* ============================================================
   STATE UPDATES
============================================================ */

function handleTick(data) {
  state.lastPrice = data.price;
  state.lastSignal = data.signal;
  state.lastConfidence = data.confidence;
  state.trades = data.trades;
  state.blocked = data.blocked;
  state.pnl = data.pnl;

  render();
}

function handleTrade(data) {
  addLog(
    `[TRADE] ${data.signal} @ ${data.price} | PNL: ${data.pnl.toFixed(2)} | #${data.trade_number}`
  );
}

function handleBlock(data) {
  addLog(
    `[BLOCK] ${data.reason} | CONF=${data.confidence?.toFixed?.(2) || "0.00"}`
  );
}

/* ============================================================
   RENDER ENGINE
============================================================ */

function render() {
  document.getElementById("price").innerText = state.lastPrice.toFixed(2);
  document.getElementById("trades").innerText = state.trades;
  document.getElementById("blocked").innerText = state.blocked;
  document.getElementById("pnl").innerText = state.pnl.toFixed(2);

  const signalEl = document.getElementById("signal");
  signalEl.innerText = state.lastSignal;

  signalEl.className = "";

  if (state.lastSignal === "BUY") signalEl.classList.add("buy");
  if (state.lastSignal === "SELL") signalEl.classList.add("sell");
  if (state.lastSignal === "HOLD") signalEl.classList.add("hold");

  const conf = document.getElementById("confidence");
  if (conf) {
    conf.innerText = state.lastConfidence.toFixed(2);
  }
}

/* ============================================================
   LOG SYSTEM (LIVE FEED)
============================================================ */

function addLog(text) {
  const log = document.getElementById("log");

  const div = document.createElement("div");
  div.className = "row";
  div.innerText = text;

  log.prepend(div);

  // prevent memory overflow
  if (log.children.length > 120) {
    log.removeChild(log.lastChild);
  }
}

/* ============================================================
   SAFETY: INITIAL RENDER BOOT
============================================================ */

render();
