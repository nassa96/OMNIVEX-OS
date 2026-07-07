export class ExecutionNormalizer {
  constructor() {}

  normalize({
    symbol,
    price,
    signal,
    risk,
    strategy,
    consensus,
    execution,
    regime
  }) {

    const base = {
      symbol,
      timestamp: Date.now(),

      market: {
        price,
        regime
      },

      signal: {
        confidence: signal?.confidence ?? 0,
        bias: signal?.bias ?? null
      },

      risk: {
        level: risk?.risk ?? "UNKNOWN",
        kill: risk?.kill ?? false
      },

      decision: {
        score: consensus?.score ?? 0,
        action: consensus?.decision ?? "REJECT"
      },

      strategy: strategy ?? "NONE",

      execution: {
        state: execution?.state ?? "UNKNOWN",
        fillPrice: execution?.fillPrice ?? null,
        source: execution?.source ?? "NONE"
      }
    };

    return {
      type: "EXECUTION_TRACE",
      payload: base
    };
  }
}
