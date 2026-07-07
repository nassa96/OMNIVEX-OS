/**
 * SAINT V71 — ENV AGGREGATOR
 * Merges all .env sources safely without duplicates
 */

const fs = require("fs");

class EnvAggregatorV71 {

  constructor(paths) {
    this.paths = paths;
    this.env = {};
  }

  load() {

    for (const p of this.paths) {

      if (!fs.existsSync(p)) continue;

      const lines = fs.readFileSync(p, "utf8").split("\n");

      for (const line of lines) {

        if (!line.includes("=")) continue;

        const [k, ...v] = line.split("=");
        const value = v.join("=");

        if (!this.env[k]) {
          this.env[k] = value;
        }
      }
    }

    return this.env;
  }
}

module.exports = EnvAggregatorV71;
