import { useEffect, useState } from "react";

export default function ChroniclePanel() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/chronicle/latest")
      .then((res) => res.json())
      .then((data) => setHistory(data.data || []));
  }, []);

  return (
    <div className="panel">
      <h2>CHRONICLE MEMORY</h2>

      <div className="log">
        {history.map((h, i) => (
          <div key={i} className="log-item">
            <span>{h.type}</span>
            <span>{JSON.stringify(h.data).slice(0, 80)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
