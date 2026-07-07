export function createWsClient(url = "ws://localhost:3000") {
  const ws = new WebSocket(url);

  const listeners = new Set();

  ws.onopen = () => {
    console.log("[WS] connected:", url);
  };

  ws.onmessage = (msg) => {
    try {
      const data = JSON.parse(msg.data);

      for (const fn of listeners) {
        fn(data);
      }
    } catch (e) {
      console.log("[WS] invalid message");
    }
  };

  ws.onclose = () => {
    console.log("[WS] disconnected");
  };

  return {
    ws,

    subscribe(fn) {
      listeners.add(fn);
    },

    unsubscribe(fn) {
      listeners.delete(fn);
    },

    send(event) {
      if (ws.readyState === 1) {
        ws.send(JSON.stringify(event));
      }
    }
  };
}
