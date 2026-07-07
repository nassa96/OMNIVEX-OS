import { useEffect, useState } from "react";

export default function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");

    ws.onmessage = (msg) => {
      setData(JSON.parse(msg.data));
    };

    return () => ws.close();
  }, []);

  if (!data) return <div>CONNECTING OMNIVEX...</div>;

  return (
    <div style={{ background: "#050505", color: "#fff", padding: 20 }}>
      <h1>OMNIVEX LIVE</h1>

      <h3>Equity: {data.equity.equity.toFixed(2)}</h3>
      <p>Delta: {data.equity.delta.toFixed(2)}</p>
      <p>Signal: {data.signal.signal}</p>
      <p>Strength: {data.signal.strength}</p>
      <p>Price: {data.tick.price.toFixed(2)}</p>
    </div>
  );
}
