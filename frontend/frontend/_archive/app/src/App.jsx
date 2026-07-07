import React, { useEffect, useState } from "react";
import WS from "./core/ws";

export default function App() {
  const [state, setState] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const unsub = WS.subscribe((data) => {
      setConnected(true);
      setState(data);
    });

    return () => unsub();
  }, []);

  return (
    <div style={{
      background: "#050505",
      color: "#00ff99",
      padding: 20,
      fontFamily: "monospace",
      minHeight: "100vh"
    }}>
      <h1>OMNIVEX LIVE KERNEL</h1>

      <div style={{ marginBottom: 10 }}>
        STATUS: {connected ? "LIVE" : "CONNECTING..."}
      </div>

      {!state ? (
        <div>WAITING FOR MARKET DATA...</div>
      ) : (
        <>
          <div>PRICE: {state.tick?.price}</div>
          <div>SIGNAL: {state.signal?.signal}</div>
          <div>REGIME: {state.regime?.regime}</div>
          <div>PNL: {state.pnl}</div>

          <pre style={{ marginTop: 20 }}>
            {JSON.stringify(state, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
}
