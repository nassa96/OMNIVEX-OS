import { useEffect, useState } from "react";
import ReplayPanel from "./ReplayPanel.jsx";
import MomentumBar from "./MomentumBar.jsx";

const COLORS = {
  BUY: "#00ff99",
  SELL: "#ff4d4d",
  HOLD: "#4da6ff",
  NO_OP: "#888"
};

export default function MarketGrid() {
  const [state, setState] = useState({});

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");

    ws.onmessage = (msg) => {
      const event = JSON.parse(msg.data);

      const symbol =
        event?.signal?.symbol ||
        event?.execution?.symbol ||
        event?.market?.symbol;

      if (!symbol) return;

      setState((prev) => ({
        ...prev,
        [symbol]: event
      }));
    };

    return () => ws.close();
  }, []);

  const symbols = ["BTC", "ETH", "SOL"];

  return (
    <div style={styles.wrap}>
      <h2>ATLAS MOMENTUM GRID V1</h2>

      <ReplayPanel />

      <div style={styles.grid}>
        {symbols.map((sym) => {
          const e = state[sym];

          const price = e?.market?.price;
          const signal = e?.signal?.signal || "HOLD";
          const risk = e?.risk?.risk || "LOW";

          const momentum = e?.signal?.momentum || 0;
          const strength = e?.signal?.strength || "NEUTRAL";

          const execState = e?.execution?.state || "IDLE";
          const execAction = e?.execution?.action || "NO_OP";

          return (
            <div key={sym} style={styles.card}>
              <h3>{sym}</h3>

              <div>PRICE: {price?.toFixed?.(2) || "--"}</div>

              <div style={{ color: COLORS[signal] }}>
                SIGNAL: {signal}
              </div>

              <div>RISK: {risk}</div>

              <MomentumBar value={momentum} />

              <div style={{ fontSize: 11, opacity: 0.8 }}>
                STRENGTH: {strength}
              </div>

              <div>EXEC STATE: {execState}</div>

              <div style={{ color: COLORS[execState] || "#888" }}>
                EXEC ACTION: {execAction}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    background: "#050505",
    color: "#00ff99",
    minHeight: "100vh",
    padding: 20,
    fontFamily: "monospace"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 12
  },
  card: {
    border: "1px solid #222",
    padding: 15,
    borderRadius: 6,
    background: "#0a0a0a"
  }
};
