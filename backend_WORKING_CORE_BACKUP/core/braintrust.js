/**
 * BRAINTRUST ENGINE
 * Unified trace + decision registry
 */

export class BrainTrust {
  constructor() {
    this.logs = [];
  }

  trace(type, payload) {
    const entry = {
      type,
      timestamp: Date.now(),
      payload
    };

    this.logs.push(entry);

    console.log(`[BRAINTRUST]`, type, payload);

    return entry;
  }

  getAll() {
    return this.logs;
  }

  clear() {
    this.logs = [];
  }
}

export const braintrust = new BrainTrust();
