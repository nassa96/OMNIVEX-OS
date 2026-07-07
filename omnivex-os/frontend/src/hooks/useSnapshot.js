import { useEffect, useState } from "react";

export function useSnapshot() {
  const [snapshot, setSnapshot] = useState(null);

  useEffect(() => {
    const fetchSnapshot = async () => {
      try {
        const res = await fetch("http://localhost:3000/snapshot");
        const data = await res.json();
        setSnapshot(data);
      } catch (e) {
        console.log("SNAPSHOT ERROR", e);
      }
    };

    fetchSnapshot();
    const interval = setInterval(fetchSnapshot, 2000);

    return () => clearInterval(interval);
  }, []);

  return snapshot;
}
