import { useEffect, useState } from "react";
import socket from "../ws/atlasSocket";

export function useSaintFeed() {
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    socket.connect();

    socket.subscribe((data) => {
      setSignals((prev) => [data, ...prev.slice(0, 50)]);
    });
  }, []);

  return signals;
}
