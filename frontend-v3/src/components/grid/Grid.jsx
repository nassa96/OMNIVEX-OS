import React, { useEffect, useState } from "react";
import { createSocket } from "../../lib/socket";

const color = (signal) => {
  if (signal === "BUY") return "#00ff99";
  if (signal === "SELL") return "#ff4d4d";
  return "#999";
};

export default function Grid() {
  const [data, setData] = useState({});
  const [log, setLog] = useState([]);

  useEffect(() => {
    const ws = createSocket((event) => {
      const sym = event.symbol;

      setData((prev) => ({
        ...prev,
        [sym]: event
      }));

      setLog((prev) => [
        {
          ts: event.ts,
          symbol: sym,
          action: event.execAction
        },
        ...prev.slice(0, 25)
      ]);
    });

    return () => ws.close();
  }, []);

  const symbols = ["BTC", "ETH", "SOL"];

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>ATLAS MOMENTUM GRID V1</div>

      <div style={styles.grid}>
        {symbols.map((s) => {
          const d = data[s];

          return (
            <div key={s} style={styles.card}>
              <div style={styles.symbol}>{s}</div>

              <div>PRICE: {d?.price ?? "--"}</div>

              <div style={{ color: color(d?.signal) }}>
                SIGNAL: {d?.signal ?? "HOLD"}
              </div>

              <div>RISK: {d?.risk ?? "LOW"}</div>

              <div>STRENGTH: {d?.strength ?? "NEUTRAL"}</div>

              <div>EXEC STATE: {d?.execState ?? "IDLE"}</div>

              <div>EXEC ACTION: {d?.execAction ?? "NO_OP"}</div>

              <div>REGIME: {d?.regime ?? "UNKNOWN"}</div>

              <div>STRAT: {d?.strategy ?? "NONE"}</div>
            </div>
          );
        })}
      </div>

      <div style={styles.log}>
        <div style={styles.logTitle}>EXECUTION TAPE</div>

        {log.map((l, i) => (
          <div key={i}>
            {new Date(l.ts).toLocaleTimeString()} → {l.symbol} {l.action}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    background: "#050505",
    color: "#fff",
    minHeight: "100vh",
    padding: 16,
    fontFamily: "monospace"
  },
  header: {
    fontSize: 18,
    marginBottom: 12,
    color: "#00ff99"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 10
  },
  card: {
    background: "#0f1115",
    padding: 10,
    borderRadius: 8,
    border: "1px solid #222"
  },
  symbol: {
    fontSize: 16,
    marginBottom: 6
  },
  log: {
    marginTop: 20,
    background: "#0a0a0a",
    padding: 10
  },
  logTitle: {
    color: "#00ff99",
    marginBottom: 6
  }
};
