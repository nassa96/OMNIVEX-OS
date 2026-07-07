import { useEffect, useState } from "react";

export default function Dashboard() {
  const [health, setHealth] = useState(null);
  const [events, setEvents] = useState([]);
  const [wsStatus, setWsStatus] = useState("DISCONNECTED");

  useEffect(() => {
    // -------------------------
    // HEALTH POLL
    // -------------------------
    const fetchHealth = async () => {
      try {
        const res = await fetch("http://localhost:3000/health");
        const data = await res.json();
        setHealth(data);
      } catch (err) {
        console.log("health error", err);
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // -------------------------
    // WS CONNECTION
    // -------------------------
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => setWsStatus("CONNECTED");
    ws.onclose = () => setWsStatus("DISCONNECTED");

    ws.onmessage = (msg) => {
      try {
        const event = JSON.parse(msg.data);
        setEvents((prev) => [event, ...prev.slice(0, 49)]);
      } catch (e) {}
    };

    return () => ws.close();
  }, []);

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.title}>OMNIVEX OS CONTROL PANEL</h1>

      <div style={styles.row}>
        <div style={styles.card}>
          <h3>System Status</h3>
          <pre>{JSON.stringify(health, null, 2)}</pre>
        </div>

        <div style={styles.card}>
          <h3>WS Bridge</h3>
          <p>Status: {wsStatus}</p>
          <p>Events: {events.length}</p>
        </div>
      </div>

      <div style={styles.cardFull}>
        <h3>Live Event Stream</h3>
        <div style={styles.stream}>
          {events.map((e, i) => (
            <div key={i} style={styles.event}>
              {e.type} — {JSON.stringify(e.payload || {})}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    background: "#050505",
    color: "#fff",
    minHeight: "100vh",
    padding: 20,
    fontFamily: "monospace"
  },
  title: {
    color: "#00ff99",
    marginBottom: 20
  },
  row: {
    display: "flex",
    gap: 10
  },
  card: {
    flex: 1,
    background: "#0f1115",
    padding: 15,
    borderRadius: 8,
    border: "1px solid #222"
  },
  cardFull: {
    marginTop: 10,
    background: "#0f1115",
    padding: 15,
    borderRadius: 8,
    border: "1px solid #222"
  },
  stream: {
    maxHeight: 400,
    overflow: "auto"
  },
  event: {
    padding: 6,
    borderBottom: "1px solid #222",
    fontSize: 12
  }
};
