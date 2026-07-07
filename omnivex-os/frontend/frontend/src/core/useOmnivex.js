import { useEffect, useReducer } from "react";

const initialState = {
  leaderboard: null,
  signals: [],
  chronicle: [],
  executions: [],
  lastSignal: null,
  lastMarket: null
};

function reducer(state, event) {
  switch (event.type) {

    case "WELCOME":
      return state;

    case "LEADERBOARD":
      return {
        ...state,
        leaderboard: event.payload
      };

    case "SIGNALS":
      return {
        ...state,
        signals: event.payload,
        lastMarket: Date.now()
      };

    case "CHRONICLE":
      return {
        ...state,
        chronicle: event.payload
      };

    case "EXECUTION":
      return {
        ...state,
        executions: [
          ...(state.executions || []),
          event.payload
        ],
        lastSignal: event.payload
      };

    default:
      return state;
  }
}

export const useOmnivex = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");

    ws.onopen = () => {
      console.log("[OMNIVEX WS] CONNECTED");
      ws.send(JSON.stringify({ type: "PING" }));
    };

    ws.onmessage = (msg) => {
      try {
        const event = JSON.parse(msg.data);

        // 🔥 CRITICAL: normalize EVERYTHING into reducer
        dispatch(event);

      } catch (e) {
        console.error("[WS PARSE ERROR]", e.message);
      }
    };

    ws.onerror = (e) => {
      console.error("[WS ERROR]", e);
    };

    return () => ws.close();
  }, []);

  return state;
};
