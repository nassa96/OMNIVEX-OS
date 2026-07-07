import { useEffect, useRef, useState } from "react";
import { createWsClient } from "../lib/wsClient";

export function useWsBridge(url) {
  const clientRef = useRef(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const client = createWsClient(url);
    clientRef.current = client;

    client.subscribe((event) => {
      setEvents((prev) => {
        const next = [event, ...prev];
        return next.slice(0, 100);
      });
    });

    return () => {
      client.ws.close();
    };
  }, [url]);

  const send = (type, payload = {}) => {
    clientRef.current?.send({
      type,
      payload
    });
  };

  return {
    events,
    send
  };
}
