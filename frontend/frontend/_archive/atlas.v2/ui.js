const WS_URL = "ws://localhost:3000";

const state = {
  symbols: {},
  logs: [],
};

const grid = document.getElementById("grid");
const log = document.getElementById("log");

function riskClass(risk) {
  if (risk === "HIGH") return "high";
  if (risk === "MEDIUM") return "medium";
  return "low";
}

function render() {
  grid.innerHTML = "";

  for (const [symbol, d] of Object.entries(state.symbols)) {
    const el = document.createElement("div");

    el.className = `card ${riskClass(d.risk.risk)}`;

    el.innerHTML = `
      <h3>${symbol}</h3>
      <div>PRICE: ${Number(d.price).toFixed(2)}</div>
      <div class="${d.signal.signal}">SIGNAL: ${d.signal.signal}</div>
      <div>RISK: ${d.risk.risk}</div>
      <div>DECISION: ${d.decision.action}</div>
      <div>EXEC: ${d.execution.action}</div>
    `;

    grid.appendChild(el);
  }

  log.innerHTML = state.logs
    .slice(-25)
    .map(l => `<div class="log">${l}</div>`)
    .join("");
}

function connect() {
  const ws = new WebSocket(WS_URL);

  ws.onopen = () => {
    console.log("ATLAS V2 CONNECTED");
  };

  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);

    if (data.type === "ATLAS_INIT") return;

    const symbol = Object.keys(data.market)[0];

    state.symbols[symbol] = {
      price: data.market[symbol],
      signal: data.signal,
      risk: data.risk,
      decision: data.decision,
      execution: data.execution,
    };

    state.logs.push(
      `${symbol} | ${data.signal.signal} | ${data.risk.risk} | ${data.decision.action} | ${data.execution.action}`
    );

    render();
  };

  ws.onclose = () => {
    setTimeout(connect, 1000);
  };
}

connect();
