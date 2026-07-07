/**
 * OMNIVEX FRONTEND WS CLIENT
 * PURE RENDER LAYER - NO LOGIC
 */

export function connectKernel(setState) {
  const ws = new WebSocket("ws://localhost:3000");

  ws.onmessage = (msg) => {
    try {
      const data = JSON.parse(msg.data);
      setState(data);
    } catch (e) {
      console.error("[WS ERROR] Invalid payload", e);
    }
  };

  ws.onclose = () => {
    setTimeout(() => connectKernel(setState), 2000);
  };

  return ws;
}
