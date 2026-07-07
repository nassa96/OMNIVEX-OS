const eventBus = require("../eventBus");
const { exec } = require("child_process");

/**
 * CHRONICLE + DOLTHUB CORE
 * Versioned memory + replay engine
 *
 * This is NOT a logger.
 * This is a deterministic system memory ledger.
 */

class ChronicleDoltCore {
  constructor() {
    this.repoPath = "./chronicle_dolt_repo";
    this.table = "omnivex_events";
  }

  init() {
    eventBus.subscribe("saint.execution", (event) => {
      this.record("execution", event);
    });

    eventBus.subscribe("sophia.signal", (event) => {
      this.record("signal", event);
    });

    eventBus.subscribe("market.tick", (event) => {
      this.record("market", event);
    });
  }

  /**
   * STEP 1: WRITE TO DOLT (VERSIONED MEMORY)
   */
  record(type, event) {
    const payload = JSON.stringify(event);

    const sql = `
      INSERT INTO ${this.table} (type, payload, ts)
      VALUES ('${type}', '${payload}', ${Date.now()});
    `;

    this.executeSQL(sql);

    // emit for downstream systems
    eventBus.publish("chronicle.event", {
      type,
      event
    });
  }

  /**
   * STEP 2: DOLT EXECUTION LAYER
   */
  executeSQL(sql) {
    const cmd = `dolt sql -q "${sql}"`;

    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        console.error("CHRONICLE DOLT ERROR:", err.message);
        return;
      }

      if (stderr) {
        console.error("CHRONICLE DOLT WARN:", stderr);
      }
    });
  }

  /**
   * STEP 3: REPLAY ENGINE
   * Reconstruct system state from history
   */
  replay(fromTs, toTs) {
    const sql = `
      SELECT * FROM ${this.table}
      WHERE ts >= ${fromTs} AND ts <= ${toTs}
      ORDER BY ts ASC;
    `;

    const cmd = `dolt sql -q "${sql}"`;

    exec(cmd, (err, stdout) => {
      if (err) {
        console.error("REPLAY ERROR:", err.message);
        return;
      }

      const events = this.parseSQL(stdout);

      eventBus.publish("chronicle.replay", {
        events
      });
    });
  }

  /**
   * STEP 4: PARSER (simple line splitter for CLI output)
   */
  parseSQL(output) {
    return output
      .split("\n")
      .filter(Boolean)
      .map(line => {
        try {
          return JSON.parse(line);
        } catch {
          return { raw: line };
        }
      });
  }
}

module.exports = new ChronicleDoltCore();
