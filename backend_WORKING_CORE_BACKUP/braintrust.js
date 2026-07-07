/**
 * BRAIN TRUST MODULE
 * Lightweight trace + memory layer for SAINT_PRIMAL
 */

export const BrainTrust = {
  logs: [],
  maxLogs: 500,

  trace(event, data = {}) {
    const entry = {
      timestamp: Date.now(),
      event,
      data
    };

    this.logs.push(entry);

    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    console.log(`[BRAINTRUST] ${event}`, data);

    return entry;
  },

  getRecent(limit = 20) {
    return this.logs.slice(-limit);
  },

  clear() {
    this.logs = [];
  }
};
