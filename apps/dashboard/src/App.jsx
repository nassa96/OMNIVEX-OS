import { useEffect, useState } from "react";
import { wsClient } from "./wsClient";

export default function App() {
  const [signals, setSignals] = useState([]);
  const [executions, setExecutions] = useState([]);
  const [risk, setRisk] = useState([]);

  useEffect(() => {
    wsClient.connect();

    wsClient.subscribe((event) => {
      if (!event) return;

      switch (event.type) {
        case "SIGNAL":
          setSignals((p) => [event, ...p].slice(0, 20));
          break;

        case "EXECUTION":
          setExecutions((p) => [event, ...p].slice(0, 20));
          break;

        case "RISK":
        case "REJECT":
          setRisk((p) => [event, ...p].slice(0, 20));
          break;

        default:
          break;
      }
    });
  }, []);

  const box = {
    padding: 10,
    border: "1px solid #222",
    marginBottom: 10,
    background: "#0f1115"
  };

  return (
    <div style={{ background: "#050505", color: "#fff", height: "100vh", display: "flex", flexDirection: "column" }}>
      
      <div style={{ padding: 10, borderBottom: "1px solid #222" }}>
        <h2>ATLAS TERMINAL v2</h2>
      </div>

      <div style={{ display: "flex", flex: 1 }}>

        {/* SIGNALS */}
        <div style={{ flex: 1, padding: 10, overflow: "auto" }}>
          <h3>SIGNALS (SOPHIA)</h3>
          {signals.map((e, i) => (
            <div key={i} style={box}>
              <div>SYMBOL: {e.data?.symbol}</div>
              <div>SIDE: {e.data?.side}</div>
              <div>CONF: {e.data?.confidence}</div>
            </div>
          ))}
        </div>

        {/* EXECUTIONS */}
        <div style={{ flex: 1, padding: 10, overflow: "auto" }}>
          <h3>EXECUTIONS (SAINT)</h3>
          {executions.map((e, i) => (
            <div key={i} style={box}>
              <div>SYMBOL: {e.data?.symbol}</div>
              <div>PRICE: {e.data?.price}</div>
              <div>SIDE: {e.data?.side}</div>
              <div>SIZE: {e.data?.size}</div>
            </div>
          ))}
        </div>

        {/* RISK */}
        <div style={{ flex: 1, padding: 10, overflow: "auto" }}>
          <h3>RISK (AEGIS)</h3>
          {risk.map((e, i) => (
            <div key={i} style={box}>
              <div>TYPE: {e.type}</div>
              <div>SYMBOL: {e.data?.symbol}</div>
              <div>STATUS: {e.data?.approved ? "APPROVED" : "BLOCKED"}</div>
              <div>REASON: {e.data?.reason || "OK"}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
