/**
 * SAINT LIQUIDITY HUB V1 — UNIFIED SCHEMA
 */

class LiquiditySnapshot {

  constructor() {
    this.orderbooks = {};   // CEX depth
    this.pools = {};        // DEX liquidity pools
    this.onchain = {};      // raw chain liquidity
  }

  updateExchange(exchange, data) {
    this.orderbooks[exchange] = data;
  }

  updatePool(protocol, data) {
    this.pools[protocol] = data;
  }

  updateChain(chain, data) {
    this.onchain[chain] = data;
  }

  getUnifiedView() {

    return {
      orderbooks: this.orderbooks,
      pools: this.pools,
      onchain: this.onchain,
      ts: Date.now()
    };
  }
}

module.exports = LiquiditySnapshot;
