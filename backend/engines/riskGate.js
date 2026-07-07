let STATE = {
  mode: "OPEN", // OPEN | WARNING | HALT
  threshold: 0.02,
  lastVolatility: 0
};

export function updateRisk(volatility = 0) {
  STATE.lastVolatility = volatility;

  if (volatility > STATE.threshold * 2) {
    STATE.mode = "HALT";
  } else if (volatility > STATE.threshold) {
    STATE.mode = "WARNING";
  } else {
    STATE.mode = "OPEN";
  }

  return STATE;
}

export function allowExecution() {
  return STATE.mode !== "HALT";
}

export function getRiskState() {
  return STATE;
}

export function setRiskMode(mode = "OPEN") {
  STATE.mode = mode;
}
