import { useEffect, useState } from "react";

export function useAtlasStream() {
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      setSignals((prev) => [data, ...prev.slice(0, 100)]);
    };

    ws.onopen = () => {
      console.log("[ATLAS UI] connected to SAINT stream");
    };

    return () => ws.close();
  }, []);

  return signals;
}
