/**
 * SAINT V64 — CHRONICLE STORAGE ENGINE
 * Persistence layer for event memory
 */

const fs = require("fs");

class ChronicleStorageV64 {

  constructor(path) {
    this.path = path || "/tmp/saint_chronicle.json";
  }

  save(events) {
    fs.writeFileSync(this.path, JSON.stringify(events, null, 2));
  }

  load() {

    if (!fs.existsSync(this.path)) return [];

    return JSON.parse(fs.readFileSync(this.path, "utf8"));
  }
}

module.exports = ChronicleStorageV64;
