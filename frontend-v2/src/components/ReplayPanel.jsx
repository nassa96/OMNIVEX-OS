import { useState } from "react";

export default function ReplayPanel() {
  const [status, setStatus] = useState("IDLE");

  async function send(action) {
    await fetch(`http://localhost:3000/replay/${action}`, {
      method: "POST"
    });

    setStatus(action.toUpperCase());
  }

  return (
    <div style={styles.panel}>
      <h3>CHRONICLE REPLAY ENGINE</h3>

      <div style={styles.row}>
        <button onClick={() => send("load")}>LOAD</button>
        <button onClick={() => send("play")}>PLAY</button>
        <button onClick={() => send("pause")}>PAUSE</button>
      </div>

      <div>Status: {status}</div>
    </div>
  );
}

const styles = {
  panel: {
    border: "1px solid #222",
    padding: 10,
    marginBottom: 10,
    background: "#0a0a0a",
    color: "#00ff99",
    fontFamily: "monospace"
  },
  row: {
    display: "flex",
    gap: 10,
    marginBottom: 10
  }
};
