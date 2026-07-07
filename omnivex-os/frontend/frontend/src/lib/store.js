import { useState } from "react";

export function useOmnivexStore() {
  const [snapshot, setSnapshot] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [cerberus, setCerberus] = useState([]);

  return {
    snapshot,
    leaderboard,
    cerberus,
    setSnapshot,
    setLeaderboard,
    setCerberus,
  };
}
