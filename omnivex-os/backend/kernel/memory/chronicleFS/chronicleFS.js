const fs = require("fs");
const path = require("path");
const eventBus = require("../eventBus");

/**
 * CHRONICLE FS
 * Dolt replacement for Termux
 * Git-style append-only memory system
 */

class ChronicleFS {
  constructor() {
    this.dir = path.join(__dirname, "ledger");
    this.ensureDir();
  }

  ensureDir() {
    if (!fs.existsSync(this.dir)) {
      fs.mkdirSync(this.dir, { recursive: true });
    }
  }

  init() {
    eventBus.subscribe("saint.execution", (e) => this.write("execution", e));
    eventBus.subscribe("sophia.signal", (e) => this.write("signal", e));
    eventBus.subscribe("market.tick", (e) => this.write("market", e));
  }

  /**
   * WRITE EVENT (APPEND ONLY)
   */
  write(type, event) {
    const entry = {
      type,
      event,
      ts: Date.now()
    };

    const file = path.join(this.dir, `${type}.log.jsonl`);

    fs.appendFileSync(file, JSON.stringify(entry) + "\n");

    eventBus.publish("chronicle.event", entry);
  }

  /**
   * REPLAY ENGINE
   */
  replay(type = null) {
    const files = type
      ? [path.join(this.dir, `${type}.log.jsonl`)]
      : fs.readdirSync(this.dir).map(f => path.join(this.dir, f));

    let events = [];

    for (const file of files) {
      if (!fs.existsSync(file)) continue;

      const lines = fs.readFileSync(file, "utf-8").split("\n").filter(Boolean);

      for (const line of lines) {
        try {
          events.push(JSON.parse(line));
        } catch {}
      }
    }

    eventBus.publish("chronicle.replay", events);
    return events;
  }
}

module.exports = new ChronicleFS();
