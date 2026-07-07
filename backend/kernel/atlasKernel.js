export class AtlasKernel {
  constructor(modules) {
    this.modules = modules;
  }

  async tick(input) {
    const { mercury, fused } = input;

    const symbol = mercury.symbol;
    const price = mercury.price;
    const prev = mercury.prev;

    const signal = this.modules.sophia.run(symbol, fused);

    const risk = this.modules.risk.run({
      symbol,
      price,
      prev
    });

    const strategy = this.modules.strategy.run({
      regime: fused?.regime || "UNKNOWN"
    });

    const consensus = this.modules.consensus.run({
      signal,
      risk,
      strategy
    });

    const execution = await this.modules.execution.runSaint(
      signal,
      risk,
      price
    );

    const trace = this.modules.trace.run({
      symbol,
      signal,
      risk,
      strategy,
      consensus,
      execution
    });

    return {
      symbol,
      fused,
      signal,
      risk,
      strategy,
      consensus,
      execution,
      trace
    };
  }
}
