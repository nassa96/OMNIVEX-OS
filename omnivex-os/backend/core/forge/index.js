class Forge {
  constructor() {
    this.agents = {
      CERBERUS: { power: 0 },
      SOPHIA: { power: 0 },
      TARTARUS: { power: 0 }
    };
  }

  update(agent, value) {
    if (!this.agents[agent]) {
      this.agents[agent] = { power: 0 };
    }
    this.agents[agent].power += value;
  }

  leaderboard() {
    const list = Object.entries(this.agents)
      .map(([agent, v]) => ({
        agent,
        power: v.power
      }))
      .sort((a, b) => b.power - a.power);

    const vals = list.map(x => x.power);
    const mean = vals.reduce((a, b) => a + b, 0) / (vals.length || 1);

    return {
      agents: list,
      dominanceField: {
        mean,
        upper: mean + 1,
        lower: mean - 1
      }
    };
  }
}

module.exports = Forge;
