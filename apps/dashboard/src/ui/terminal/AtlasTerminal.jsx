import React, { useEffect, useState } from "react";

export default function AtlasTerminal() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const tick = {
        time: new Date().toISOString(),
        event: "SAINT_TICK",
        pnl: (Math.random() * 2 - 1).toFixed(4),
        risk: (Math.random() * 10).toFixed(2),
        signal: ["BUY", "SELL", "HOLD"][Math.floor(Math.random() * 3)]
      };

      setLogs(prev => [tick, ...prev].slice(0, 60));
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="atlas-terminal">
      {logs.map((l, i) => (
        <div key={i}>
          [{l.time}] | {l.event} | SIGNAL: {l.signal} | PnL: {l.pnl} | RISK: {l.risk}
        </div>
      ))}
    </div>
  );
}
