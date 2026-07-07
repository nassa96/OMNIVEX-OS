export const AEGIS_POLICY = {
  KILL_SWITCH: {
    BTC: { max: 200000, min: 0 },
    ETH: { max: 15000, min: 0 },
    SOL: { max: 800, min: 0 }
  },

  RISK_THRESHOLDS: {
    LOW: 25,
    MEDIUM: 60,
    HIGH: 100
  },

  POSITION_LIMITS: {
    BTC: 5,
    ETH: 20,
    SOL: 200
  }
};
