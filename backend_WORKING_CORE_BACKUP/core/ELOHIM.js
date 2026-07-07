class ELOHIM {
  constructor(state) {
    this.state = state;
  }

  decide(sophiaSignal, volatility) {
    let finalSignal = { ...sophiaSignal };

    // override rules
    if (volatility > 15) {
      finalSignal.signal = "BLOCKED";
      finalSignal.reason = "ELOHIM_VOLATILITY_LOCK";
      finalSignal.strength = 0;
    }

    if (this.state.status === "AEGIS_KILL_SWITCH") {
      finalSignal.signal = "DISABLED";
      finalSignal.reason = "SYSTEM_LOCKED";
    }

    return finalSignal;
  }
}

module.exports = ELOHIM;
