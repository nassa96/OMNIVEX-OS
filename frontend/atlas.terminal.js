/**
 * ATLAS TERMINAL UI (CLI WebSocket Frontend)
 * - Live multi-symbol stream
 * - Color-coded signals
 * - Risk overlay (kill-switch aware)
 * - SAINT execution log panel
 */

const WS_URL = "ws://localhost:3000";

/**
 * ANSI COLORS (CLI STYLE)
 */
const C = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
  bold: "\x1b[1m",
};

function colorSignal(signal) {
  if (signal === "BUY") return C.green;
  if (signal === "SELL") return C.red;
  return C.yellow;
}

function colorRisk(risk) {
  if (risk === "HIGH") return C.red;
  if (risk === "MEDIUM") return C.yellow;
  return C.green;
}

/**
 * TERMINAL STATE
 */
const STATE = {
  latest: {},
  logs: [],
};

/**
 * RENDER LOOP (CLI GRID DASHBOARD)
 */
function render() {
  console.clear();

  console.log(C.bold + "ATLAS TERMINAL (LIVE)" + C.reset);
  console.log("=====================================\n");

  const symbols = Object.keys(STATE.latest);

  for (const symbol of symbols) {
    const d = STATE.latest[symbol];

    const signalColor = colorSignal(d.signal.signal);
    const riskColor = colorRisk(d.risk.risk);

    console.log(
      `${C.cyan}${symbol}${C.reset} | ` +
        `PRICE: ${d.signal.price.toFixed(2)} | ` +
        `SIGNAL: ${signalColor}${d.signal.signal}${C.reset} | ` +
        `RISK: ${riskColor}${d.risk.risk}${C.reset} | ` +
        `DECISION: ${d.decision.action}`
    );
  }

  console.log("\n--- SAINT EXECUTION LOG ---");

  STATE.logs.slice(-8).forEach((log) => {
    console.log(log);
  });

  console.log("\n-------------------------------------");
}

/**
 * WS CONNECTION (LIVE FEED)
 */
function start() {
  const ws = new WebSocket(WS_URL);

  ws.onopen = () => {
    console.log("CONNECTED TO OMNIVEX KERNEL");
  };

  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);

    if (data.type === "ATLAS_INIT") return;

    const symbol = data.signal.symbol;

    STATE.latest[symbol] = data;

    /**
     * SAINT EXEC LOG
     */
    const exec =
      data.decision.action === "BUY"
        ? "EXECUTED"
        : data.decision.action === "SELL"
        ? "EXECUTED"
        : "NO_OP";

    STATE.logs.push(
      `[${symbol}] ${data.signal.signal} | ` +
        `RISK=${data.risk.risk} | ` +
        `DECISION=${data.decision.action} | ` +
        `EXEC=${exec}`
    );

    if (STATE.logs.length > 50) STATE.logs.shift();

    render();
  };

  ws.onclose = () => {
    console.log("DISCONNECTED - RECONNECTING...");
    setTimeout(start, 2000);
  };
}

start();
