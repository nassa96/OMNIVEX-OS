let state = {
  totalReward: 0,
  trades: 0,
  bias: {
    HOLD: 0,
    BUY: 0,
    SELL: 0
  }
};

function calculateOutcome({ decision, market }) {
  const future = market.price + (Math.random() - 0.5) * 200;

  if (decision.action === "BUY") {
    return future > market.price ? "WIN" : "LOSS";
  }

  if (decision.action === "SELL") {
    return future < market.price ? "WIN" : "LOSS";
  }

  return "NEUTRAL";
}

function updateLearning({ decision, market }) {
  const outcome = calculateOutcome({ decision, market });

  let reward = 0;

  if (outcome === "WIN") reward = 1;
  if (outcome === "LOSS") reward = -1;
  if (outcome === "NEUTRAL") reward = 0.1;

  state.totalReward += reward;
  state.trades += 1;

  const action = decision.action || "HOLD";
  state.bias[action] += reward;

  return {
    reward,
    outcome,
    state
  };
}

function getState() {
  return state;
}

export { updateLearning, getState };
