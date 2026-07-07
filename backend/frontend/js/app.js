import { getHealth, getSignal, getBraintrust, getChronicle } from './api/client.js';

const app = document.getElementById("app");

window.navigate = async (view) => {
  if (view === "dashboard") return loadDashboard();
  if (view === "signals") return loadSignals();
  if (view === "braintrust") return loadBraintrust();
  if (view === "chronicle") return loadChronicle();
};

async function loadDashboard() {
  const data = await getHealth();

  app.innerHTML = `
    <div class="card">
      <div class="title">SYSTEM</div>
      <div class="value">${data.status}</div>
    </div>

    <div class="card">
      <div class="title">MARKET</div>
      <div class="value">${data.market.price}</div>
    </div>

    <div class="card">
      <div class="title">TICKS</div>
      <div class="value">${data.ticks}</div>
    </div>
  `;
}

async function loadSignals() {
  const data = await getSignal();

  app.innerHTML = `
    <div class="card">
      <div class="title">SIGNAL</div>
      <div class="value">${data.signal}</div>
    </div>

    <div class="card">
      <div class="title">STRENGTH</div>
      <div class="value">${data.strength}</div>
    </div>

    <div class="card">
      <div class="title">REASON</div>
      <div class="value">${data.reason}</div>
    </div>
  `;
}

async function loadBraintrust() {
  const data = await getBraintrust();

  app.innerHTML = `
    <div class="card">
      <div class="title">BRAINTRUST LOGS</div>
      <pre>${JSON.stringify(data.slice(-10), null, 2)}</pre>
    </div>
  `;
}

async function loadChronicle() {
  const data = await getChronicle();

  app.innerHTML = `
    <div class="card">
      <div class="title">CHRONICLE HISTORY</div>
      <pre>${JSON.stringify(data.slice(-10), null, 2)}</pre>
    </div>
  `;
}

/* boot */
loadDashboard();
