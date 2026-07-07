const STATE = {
  IDLE: "IDLE",
  ARMED: "ARMED",
  EXECUTED: "EXECUTED",
  BLOCKED: "BLOCKED"
};

/**
 * ACTIVE EXECUTION STATE MACHINE
 */
export function runExecutionEngine(signal, risk) {
  const action = signal?.signal;
  const symbol = signal?.symbol;

  // HARD RISK KILL SWITCH
  if (risk?.kill === true || risk?.risk === "HIGH") {
    return {
      symbol,
      state: STATE.BLOCKED,
      action: "NO_OP",
      reason: "AEGIS_KILL_SWITCH"
    };
  }

  // HOLD STATE
  if (action === "HOLD") {
    return {
      symbol,
      state: STATE.IDLE,
      action: "NO_OP"
    };
  }

  // ARM EXECUTION
  if (action === "BUY" || action === "SELL") {
    return {
      symbol,
      state: STATE.ARMED,
      action,
      queued: true
    };
  }

  return {
    symbol,
    state: STATE.IDLE,
    action: "NO_OP"
  };
}

/**
 * PAPER FILL ENGINE
 */
export function simulateFill(exec, price) {
  if (!exec || exec.state !== STATE.ARMED) return exec;

  return {
    ...exec,
    state: STATE.EXECUTED,
    fillPrice: price,
    filled: true,
    slippage: (Math.random() - 0.5) * 0.02
  };
}
