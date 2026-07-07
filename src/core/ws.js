const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://100.75.182.117:3000";

/**
 * REST API
 */
export async function fetchBrain() {
  const res = await fetch(`${BACKEND_URL}/api/brain`);
  return res.json();
}

/**
 * WEBSOCKET STREAM
 */
export function connectWS(onMessage) {
  const wsBase = BACKEND_URL.replace("http://", "").replace("https://", "");
  const wsUrl = `ws://${wsBase}`;

  const ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    console.log("[WS] connected");
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (err) {
      console.log("[WS RAW]", event.data);
    }
  };

  ws.onerror = (err) => {
    console.log("[WS ERROR]", err);
  };

  ws.onclose = () => {
    console.log("[WS] disconnected");
  };

  return ws;
}
