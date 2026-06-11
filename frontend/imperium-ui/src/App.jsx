import { useEffect, useState } from "react";
import { pingBackend } from "./api";

export default function App() {
  const [status, setStatus] = useState("loading...");

  useEffect(() => {
    pingBackend()
      .then((data) => setStatus(data.engine))
      .catch(() => setStatus("backend disconnected"));
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>IMPERIUM DASHBOARD</h1>
      <p>Backend Status: {status}</p>
    </div>
  );
}
