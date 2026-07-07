import { useEffect, useState } from "react";

export default function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("http://localhost:3000/health");
      setData(await res.json());
    };

    load();
    const t = setInterval(load, 2000);

    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ color:"#00ff99", background:"#050505", padding:20 }}>
      <h1>OMNIVEX CANONICAL UI</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
