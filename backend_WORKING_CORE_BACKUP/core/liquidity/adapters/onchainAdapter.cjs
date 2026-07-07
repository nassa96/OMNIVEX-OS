class OnChainAdapter {

  constructor(providerName) {
    this.providerName = providerName;
  }

  async fetchMock() {

    // placeholder for real RPC / indexer integration
    return {
      chain: this.providerName,
      liquidityUSD: Math.random() * 10000000,
      gas: Math.random() * 100
    };
  }

  async poll(onUpdate) {

    setInterval(async () => {

      const data = await this.fetchMock();

      onUpdate({
        chain: this.providerName,
        liquidity: data,
        ts: Date.now()
      });

    }, 5000);
  }
}

module.exports = OnChainAdapter;
