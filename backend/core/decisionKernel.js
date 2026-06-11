let state = {
  lastSignal: null,
  streak: 0,
  cooldown: 0
};

export function decisionKernel({ signal, confidence, risk }) {
  const now = Date.now();

  if (now < state.cooldown) {
    return { allow: false, reason: "COOLDOWN" };
  }

  if (confidence < 0.65) {
    return { allow: false, reason: "LOW_CONFIDENCE" };
  }

  if (signal === state.lastSignal) {
    state.streak++;
    if (state.streak < 3) {
      return { allow: false, reason: "STREAK_FILTER" };
    }
  } else {
    state.streak = 0;
  }

  state.lastSignal = signal;
  state.cooldown = now + (risk === "HIGH" ? 8000 : 3000);

  return { allow: true, reason: "OK" };
}
