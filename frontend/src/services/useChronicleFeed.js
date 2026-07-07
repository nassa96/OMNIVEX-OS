import { useEffect, useState } from "react";

export function useChronicleFeed() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/chronicle/latest")
      .then((res) => res.json())
      .then((data) => {
        setHistory(data.data || []);
      });
  }, []);

  return history;
}
