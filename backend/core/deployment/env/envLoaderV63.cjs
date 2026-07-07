/**
 * SAINT V63 — ENV LOADER + MERGER
 * Merges multiple .env sources safely
 */

const fs = require("fs");
const path = require("path");

class EnvLoaderV63 {

  constructor(paths) {
    this.paths = paths || [];
    this.env = {};
  }

  load() {

    for (const p of this.paths) {

      if (!fs.existsSync(p)) continue;

      const raw = fs.readFileSync(p, "utf8")
        .split("\n");

      for (const line of raw) {

        if (!line.includes("=")) continue;

        const [key, ...vals] = line.split("=");
        const value = vals.join("=");

        if (!this.env[key]) {
          this.env[key] = value;
        }
      }
    }

    return this.env;
  }

  get(key) {
    return this.env[key];
  }
}

module.exports = EnvLoaderV63;
