const state = {
  market: null,
  lastSignal: null,
  lastExecution: null,
  pnl: 0,
  risk: "LOW"
};

export function updateState(key, value) {
  state[key] = value;
}

export function getState() {
  return state;
}
