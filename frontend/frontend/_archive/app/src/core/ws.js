/**
 * OMNIVEX FRONTEND WS CLIENT (FIXED FOR TERMUX + MOBILE)
 */

let ws = null;
let listeners = [];

function getBackendURL() {
  // IMPORTANT:
  // mobile browser must NOT use localhost
  const host = window.location.hostname;

  return `ws://${host}:3000`;
}

function connect() {
  const url = getBackendURL();

  console.log("[WS] connecting to", url);

  ws = new WebSocket(url);

  ws.onopen = () => {
    console.log("[WS] connected");
  };

  ws.onmessage = (msg) => {
    try {
      const data = JSON.parse(msg.data);
      listeners.forEach(fn => fn(data));
    } catch (e) {}
  };

  ws.onclose = () => {
    console.log("[WS] disconnected — retrying");
    setTimeout(connect, 1500);
  };

  ws.onerror = () => {
    ws.close();
  };
}

function subscribe(fn) {
  listeners.push(fn);

  if (!ws || ws.readyState === WebSocket.CLOSED) {
    connect();
  }

  return () => {
    listeners = listeners.filter(l => l !== fn);
  };
}

export default {
  subscribe
};
