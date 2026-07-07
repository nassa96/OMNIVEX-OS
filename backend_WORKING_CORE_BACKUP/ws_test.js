import WebSocket from "ws";

const ws = new WebSocket("ws://127.0.0.1:4000");

ws.on("open", () => {
  console.log("CONNECTED TO SERVER");
  ws.send(JSON.stringify({ hello: "world" }));
});

ws.on("message", (data) => {
  console.log("FROM SERVER:", data.toString());
});

ws.on("error", (err) => {
  console.log("WS ERROR:", err.message);
});
