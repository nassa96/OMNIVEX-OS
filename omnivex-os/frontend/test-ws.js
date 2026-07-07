import WebSocket from "ws";

const ws = new WebSocket("ws://localhost:8080");

ws.on("open", () => {
  console.log("CONNECTED");

  ws.send(JSON.stringify({
    type: "signal.test",
    action: "EXECUTE",
    score: 0.87
  }));
});

ws.on("message", (msg) => {
  console.log("FROM SERVER:", msg.toString());
});

ws.on("error", (err) => {
  console.log("ERROR:", err.message);
});
