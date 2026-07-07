import { useEffect, useState } from "react";

export default function ChroniclePanel({ events, snapshot }) {
  const [timeline, setTimeline] = useState([]);

  /* =========================
     BUILD CHRONICLE MEMORY
  ========================= */
  useEffect(() => {
    if (!events) return;

    setTimeline((prev) => {
      const merged = [...events, ...prev];

      // Deduplicate + cap memory
      return merged.slice(0, 200);
    });
  }, [events]);

  return (
    <div style={styles.wrap}>
      <h3>CHRONICLE MEMORY ENGINE</h3>

      {!timeline.length ? (
        <p>No historical data yet</p>
      ) : (
        timeline.map((e, i) => (
          <div key={i} style={styles.row}>
            <div style={styles.type}>{e.type}</div>

            <div style={styles.data}>
              {e.symbol ? e.symbol : ""}
              {e.signal ? ` ${e.signal}` : ""}
              {e.price ? ` ${e.price}` : ""}
            </div>

            <div style={styles.ts}>{e.ts}</div>
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
  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 0",
    borderBottom: "1px solid #222"
  },
  type: {
    width: 80,
    color: "#ffaa00"
  },
  data: {
    flex: 1
  },
  ts: {
    color: "#666",
    fontSize: 10
  }
};
