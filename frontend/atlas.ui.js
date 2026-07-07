/**
 * ATLAS UI DASHBOARD (WEB + LIVE WS VIEW)
 * - Multi-symbol grid
 * - Live execution feed
 * - Risk + decision visualization
 * - Minimal dependency frontend (vanilla JS)
 */

const WS_URL = "ws://localhost:3000";

const STATE = {
  symbols: {},
  logs: [],
};

const COLORS = {
  BUY: "🟢",
  SELL: "🔴",
  HOLD: "🟡",
  KILL: "⛔",
};

/**
 * DOM INIT
 */
document.body.innerHTML = `
  <div style="font-family: monospace; background:#0b0f14; color:#d1d5db; padding:20px;">
    <h2>ATLAS TERMINAL</h2>
    <div id="grid"></div>
    <hr/>
    <h3>EXECUTION LOG</h3>
    <div id="log"></div>
  </div>
`;

const grid = document.getElementById("grid");
const log = document.getElementById("log");

/**
 * RENDER GRID
 */
function renderGrid() {
  grid.innerHTML = "";

  for (const symbol of Object.keys(STATE.symbols)) {
    const d = STATE.symbols[symbol];

    const el = document.createElement("div");
    el.style = `
      border:1px solid #1f2937;
      padding:10px;
      margin:10px 0;
      border-radius:6px;
    `;

    el.innerHTML = `
      <b>${symbol}</b><br/>
      PRICE: ${d.price.toFixed(2)}<br/>
      SIGNAL: ${COLORS[d.signal.signal] || "⚪"} ${d.signal.signal}<br/>
      RISK: ${d.risk.risk}<br/>
      DECISION: ${d.decision.action}<br/>
      EXEC: ${d.execution.action}
    `;

    grid.appendChild(el);
  }
}

/**
 * RENDER LOG
 */
function renderLog() {
  log.innerHTML = "";

  STATE.logs.slice(-10).forEach((l) => {
    const div = document.createElement("div");
    div.textContent = l;
    log.appendChild(div);
  });
}

/**
 * WS CONNECTION
 */
function start() {
  const ws = new WebSocket(WS_URL);

  ws.onopen = () => {
    console.log("ATLAS UI CONNECTED");
  };

  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);

    if (data.type === "ATLAS_INIT") return;

    const symbol = Object.keys(data.market)[0];

    STATE.symbols[symbol] = {
      price: data.market[symbol],
      signal: data.signal,
      risk: data.risk,
      decision: data.decision,
      execution: data.execution,
    };

    STATE.logs.push(
      `${symbol} | ${data.signal.signal} | ${data.risk.risk} | ${data.decision.action} | ${data.execution.action}`
    );

    renderGrid();
    renderLog();
  };

  ws.onclose = () => {
    setTimeout(start, 2000);
  };
}

start();
