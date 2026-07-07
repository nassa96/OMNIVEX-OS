import React from "react";
import { useOmnivex } from "./core/useOmnivex";

export default function App() {
  const { leaderboard, signals, chronicle } = useOmnivex();

  return (
    <div style={{
      background: "#050505",
      color: "#00ff99",
      fontFamily: "monospace",
      height: "100vh",
      overflow: "auto",
      padding: 20
    }}>

      <h2>OMNIVEX CONTROL PANEL (LIVE)</h2>

      {/* ================= LEADERBOARD ================= */}
      <section style={{ marginTop: 20 }}>
        <h3>LEADERBOARD (AGENT DOMINANCE)</h3>

        {leaderboard?.agents?.length ? (
          leaderboard.agents.map((a, i) => (
            <div key={i}>
              {a.agent} → PnL: {a.pnl}
            </div>
          ))
        ) : (
          <div>Waiting for agent signals...</div>
        )}

        {leaderboard?.envelope && (
          <div style={{ marginTop: 10 }}>
            ENVELOPE:
            {" "}
            mean={leaderboard.envelope.mean.toFixed(2)} |
            upper={leaderboard.envelope.upper.toFixed(2)} |
            lower={leaderboard.envelope.lower.toFixed(2)}
          </div>
        )}
      </section>

      {/* ================= SIGNALS ================= */}
      <section style={{ marginTop: 30 }}>
        <h3>MARKET SIGNALS</h3>

        {signals?.length ? (
          signals.slice(0, 10).map((s, i) => (
            <div key={i}>
              {s.symbol || s.asset} |
              price: {s.price} |
              vol: {s.volume} |
              score: {s.score?.toFixed?.(3)} |
              {s.signal}
            </div>
          ))
        ) : (
          <div>Loading market stream...</div>
        )}
      </section>

      {/* ================= CHRONICLE ================= */}
      <section style={{ marginTop: 30 }}>
        <h3>CHRONICLE MEMORY STREAM</h3>

        {chronicle?.length ? (
          chronicle.slice(-15).map((e, i) => (
            <div key={i}>
              {e.type} | {new Date(e.ts).toLocaleTimeString()}
            </div>
          ))
        ) : (
          <div>No historical data yet</div>
        )}
      </section>

    </div>
  );
}
