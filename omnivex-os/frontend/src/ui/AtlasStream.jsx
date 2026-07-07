import { useEffect, useState } from "react";
import { omnivexStream } from "../lib/omnivexStream";

export default function AtlasStream() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    omnivexStream.subscribe("*", (event) => {
      setEvents(prev => [event, ...prev].slice(0, 50));
    });
  }, []);

  return (
    <div className="text-green-400 font-mono text-xs">
      {events.map((e, i) => (
        <div key={i}>
          [{e.type}] {JSON.stringify(e.payload || e)}
        </div>
      ))}
    </div>
  );
}
