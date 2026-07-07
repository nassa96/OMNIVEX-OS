class RuntimeSnapshot {
  constructor({ cerberus, forge, chronicle, mercury }) {
    this.cerberus = cerberus;
    this.forge = forge;
    this.chronicle = chronicle;
    this.mercury = mercury;
  }

  async get() {
    const cerberusState = this.cerberus?.getLatest?.() || [];
    const leaderboard = this.forge?.leaderboard?.() || [];
    const memory = this.chronicle?.query?.({}) || [];
    const market = await this.mercury?.scan?.();

    return {
      timestamp: Date.now(),
      cerberus: cerberusState,
      leaderboard,
      memory,
      market,
    };
  }
}

module.exports = RuntimeSnapshot;
