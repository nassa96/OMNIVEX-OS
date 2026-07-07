import { useEffect, useState } from "react";

const SYMBOLS = ["BTC", "ETH", "SOL"];

export default function App() {
  const [data, setData] = useState({});

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");

    ws.onmessage = (msg) => {
      const event = JSON.parse(msg.data);

      const symbol = Object.keys(event.market || {})[0];

      setData((prev) => ({
        ...prev,
        [symbol]: event,
      }));
    };

    return () => ws.close();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>ATLAS TERMINAL</h1>

      <div style={{ display: "grid", gap: 12 }}>
        {SYMBOLS.map((sym) => {
          const e = data[sym];

          return (
            <div
              key={sym}
              style={{
                border: "1px solid #00ff99",
                padding: 12,
              }}
            >
              <h2>{sym}</h2>

              {e ? (
                <>
                  <div>PRICE: {e.market?.[sym]}</div>

                  <div>SIGNAL: {e.signal?.signal}</div>

                  <div>
                    RISK: {e.risk?.risk}{" "}
                    {e.risk?.kill ? "🚨 KILL" : ""}
                  </div>

                  <div>DECISION: {e.decision?.action}</div>

                  <div>
                    EXEC: {e.execution?.status}
                  </div>
                </>
              ) : (
                <div>WAITING STREAM...</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
