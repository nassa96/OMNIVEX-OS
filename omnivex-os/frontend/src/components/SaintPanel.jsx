import { useEffect, useState } from "react";

export default function SaintPanel({ snapshot }) {
  const [execution, setExecution] = useState({
    state: "IDLE",
    lastSignal: null,
    lastDecision: null,
    history: []
  });

  useEffect(() => {
    if (!snapshot) return;

    setExecution((prev) => ({
      ...prev,
      lastSignal: snapshot.lastSignal || "HOLD"
    }));
  }, [snapshot]);

  /* =========================
     SIMULATED EXECUTION PIPELINE
  ========================= */
  const simulateExecution = () => {
    const signals = ["BUY", "HOLD", "SELL"];
    const pick = signals[Math.floor(Math.random() * signals.length)];

    const decision = {
      signal: pick,
      approved: pick !== "SELL" ? true : Math.random() > 0.5,
      ts: Date.now()
    };

    setExecution((prev) => ({
      state: "EXECUTED",
      lastSignal: pick,
      lastDecision: decision,
      history: [decision, ...prev.history.slice(0, 20)]
    }));
  };

  return (
    <div style={styles.wrap}>
      <h3>SAINT EXECUTION ENGINE</h3>

      {/* CURRENT STATE */}
      <div style={styles.block}>
        <div>STATE: {execution.state}</div>
        <div>LAST SIGNAL: {execution.lastSignal}</div>
      </div>

      {/* EXECUTION CONTROLS (SIM ONLY) */}
      <div style={styles.block}>
        <button onClick={simulateExecution} style={styles.button}>
          SIMULATE EXECUTION
        </button>
      </div>

      {/* LAST DECISION */}
      {execution.lastDecision && (
        <div style={styles.block}>
          <h4>LAST DECISION</h4>
          <div>SIGNAL: {execution.lastDecision.signal}</div>
          <div>
            APPROVED:{" "}
            <span
              style={{
                color: execution.lastDecision.approved ? "#00ff99" : "#ff4d4d"
              }}
            >
              {execution.lastDecision.approved ? "YES" : "NO"}
            </span>
          </div>
          <div>TS: {execution.lastDecision.ts}</div>
        </div>
      )}

      {/* HISTORY */}
      <div style={styles.block}>
        <h4>EXECUTION HISTORY</h4>
        {execution.history.length === 0 ? (
          <p>No executions yet</p>
        ) : (
          execution.history.map((h, i) => (
            <div key={i}>
              {h.signal} | {h.approved ? "APPROVED" : "REJECTED"} | {h.ts}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    marginTop: 20,
    padding: 10,
    background: "#0f1115",
    border: "1px solid #222",
    color: "#00ff99"
  },
  block: {
    marginTop: 10,
    paddingBottom: 10,
    borderBottom: "1px solid #222"
  },
  button: {
    background: "#00ff99",
    color: "#000",
    padding: 8,
    border: "none",
    cursor: "pointer"
  }
};
