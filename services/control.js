export const controlState = {
  mode: "PAPER", // LIVE | PAPER | OFF
  tradingEnabled: true,

  setMode(mode) {
    this.mode = mode;
  },

  killSwitch() {
    this.tradingEnabled = false;
  }
};
