import { useEffect, useState } from "react";

export default function ChronicleReplay() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");

    ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);

        // ONLY accept structured events
        if (!data.type || !data.symbol) return;

        setEvents((prev) => {
          const next = [data, ...prev];

          // HARD LIMIT + DEDUP BY TIMESTAMP+SYMBOL
          const seen = new Set();
          return next
            .filter((e) => {
              const key = `${e.symbol}-${e.ts}`;
              if (seen.has(key)) return false;
              seen.add(key);
              return true;
            })
            .slice(0, 100);
        });

      } catch (e) {}
    };

    return () => ws.close();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ color: "#00ff99" }}>CHRONICLE STREAM</h2>

      <div style={{ marginTop: 10 }}>
        {events.map((e, i) => (
          <div key={i} style={{ marginBottom: 6 }}>
            <span style={{ color: "#4da6ff" }}>{e.type}</span> |
            <span> {e.symbol}</span> |
            <span> {e.action || "-"}</span> |
            <span> {e.price || "-"}</span> |
            <span> {e.ts}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
