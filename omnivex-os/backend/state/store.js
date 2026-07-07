export let state = {
  running: true,
  risk: 'MED',
  position_size: 0.05,
  price: null,
  symbol: 'BTC',
  lastTrade: null
}

export function getState() {
  return state
}

export function setState(update) {
  state = { ...state, ...update }
}
