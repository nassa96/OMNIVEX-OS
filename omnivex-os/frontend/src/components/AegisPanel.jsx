import { useEffect, useState } from "react";

export default function AegisPanel({ snapshot }) {
  const [risk, setRisk] = useState(null);
  const [exec, setExec] = useState(null);

  useEffect(() => {
    if (!snapshot?.config) return;

    setRisk(snapshot.config.risk || null);
    setExec(snapshot.config.execution || null);
  }, [snapshot]);

  if (!risk) {
    return (
      <div style={styles.wrap}>
        <h3>AEGIS RISK ENGINE</h3>
        <p>Loading risk governor...</p>
      </div>
    );
  }

  const riskScore =
    (risk.maxPositionSize * 100 +
      risk.maxDrawdown * 100 +
      risk.volatilityLimit * 100) /
    3;

  return (
    <div style={styles.wrap}>
      <h3>AEGIS RISK GOVERNOR</h3>

      {/* EXECUTION STATE */}
      <div style={styles.block}>
        <h4>EXECUTION</h4>
        <div>
          STATUS:{" "}
          <span style={{ color: exec?.enabled ? "#00ff99" : "#ff4d4d" }}>
            {exec?.enabled ? "ENABLED" : "DISABLED"}
          </span>
        </div>
        <div>
          MUTATION:{" "}
          <span style={{ color: exec?.mutationEnabled ? "#00ff99" : "#ff4d4d" }}>
            {exec?.mutationEnabled ? "ON" : "OFF"}
          </span>
        </div>
      </div>

      {/* RISK METRICS */}
      <div style={styles.block}>
        <h4>RISK PARAMETERS</h4>

        <div>Max Position Size: {risk.maxPositionSize}</div>
        <div>Max Drawdown: {risk.maxDrawdown}</div>
        <div>Volatility Limit: {risk.volatilityLimit}</div>

        {/* RISK BAR */}
        <div style={styles.bar}>
          <div
            style={{
              width: risk.maxPositionSize * 100 + "%",
              background: "#00ff99",
              height: 6
            }}
          />
          <div
            style={{
              width: risk.maxDrawdown * 100 + "%",
              background: "#ffaa00",
              height: 6
            }}
          />
          <div
            style={{
              width: risk.volatilityLimit * 100 + "%",
              background: "#ff4d4d",
              height: 6
            }}
          />
        </div>

        {/* RISK SCORE */}
        <div style={{ marginTop: 10 }}>
          RISK SCORE: {riskScore.toFixed(2)} / 100
        </div>
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
  bar: {
    display: "flex",
    marginTop: 8
  }
};
