import { useEffect, useState } from "react";

export default function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000");

    ws.onopen = () => {
      console.log("ATLAS WS CONNECTED");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages((prev) => [...prev, data]);
      } catch (e) {
        console.log("WS RAW:", event.data);
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "monospace" }}>
      <h2>ATLAS FRONTEND</h2>

      <pre>Status: CONNECTED</pre>

      <h3>Messages</h3>
      <pre>{JSON.stringify(messages, null, 2)}</pre>
    </div>
  );
}
