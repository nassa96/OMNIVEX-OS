export const CONFIG = {
  SYSTEM_NAME: "OMNIVEX_OS",

  SERVER: {
    PORT: 3000,
    WS_HEARTBEAT: 5000
  },

  MODE: "SIM",

  RISK: {
    maxPositionSize: 0.05,
    maxDrawdown: 0.08,
    volatilityLimit: 0.1
  },

  EXECUTION: {
    enabled: true,
    mutationEnabled: true
  },

  FEEDS: {
    mercury: true
  }
};
