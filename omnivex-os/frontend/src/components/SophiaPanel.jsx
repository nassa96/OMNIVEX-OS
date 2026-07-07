import { useEffect, useState } from "react";

export default function SophiaPanel({ snapshot }) {
  const [strategies, setStrategies] = useState({});

  useEffect(() => {
    if (snapshot?.strategies) {
      setStrategies(snapshot.strategies);
    }
  }, [snapshot]);

  return (
    <div style={styles.wrap}>
      <h3>SOPHIA STRATEGY MATRIX</h3>

      {!strategies || Object.keys(strategies).length === 0 ? (
        <p>Loading strategy engine...</p>
      ) : (
        Object.entries(strategies).map(([name, values]) => (
          <div key={name} style={styles.card}>
            <h4>{name}</h4>

            <div>BUY: {values.BUY}</div>
            <div>HOLD: {values.HOLD}</div>
            <div>SELL: {values.SELL}</div>

            <div style={styles.bar}>
              <div style={{ width: values.BUY * 100 + "%", background: "#00ff99", height: 6 }} />
              <div style={{ width: values.HOLD * 100 + "%", background: "#ffaa00", height: 6 }} />
              <div style={{ width: values.SELL * 100 + "%", background: "#ff4d4d", height: 6 }} />
            </div>
          </div>
        ))
      )}
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
  card: {
    marginTop: 10,
    padding: 10,
    borderBottom: "1px solid #222"
  },
  bar: {
    display: "flex",
    marginTop: 6
  }
};
