/**
 * =========================================================
 * CHRONICLE PERSISTENT REPLAY ENGINE (TERMUX SAFE)
 * Uses sql.js (WASM SQLite) → no native build required
 * =========================================================
 */

const fs = require("fs");
const path = require("path");
const initSqlJs = require("sql.js");

// persistent DB file
const DB_PATH = path.join(__dirname, "chronicle.db");

let db;

/**
 * Initialize SQLite memory + disk persistence
 */
async function init() {
  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const filebuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(filebuffer);
  } else {
    db = new SQL.Database();

    db.run(`
      CREATE TABLE IF NOT EXISTS replay (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ts INTEGER,
        tick TEXT,
        signal TEXT,
        regime TEXT,
        capital TEXT,
        pnl REAL,
        reward REAL
      );
    `);

    persist();
  }

  console.log("[CHRONICLE] SQLite replay engine online");
}

/**
 * Persist DB to disk
 */
function persist() {
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

/**
 * Log full trading event
 */
function logEvent(event) {
  const stmt = db.prepare(`
    INSERT INTO replay (ts, tick, signal, regime, capital, pnl, reward)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run([
    Date.now(),
    JSON.stringify(event.tick || {}),
    JSON.stringify(event.signal || {}),
    JSON.stringify(event.regime || {}),
    JSON.stringify(event.capital || {}),
    event.pnl || 0,
    event.reward || 0
  ]);

  stmt.free();

  persist();
}

/**
 * Load last N events (for learning loop)
 */
function getRecent(limit = 50) {
  const res = db.exec(`
    SELECT * FROM replay
    ORDER BY id DESC
    LIMIT ${limit}
  `);

  return res.length ? res[0].values : [];
}

/**
 * Replay learning hook (future RL training layer)
 */
function replaySample() {
  return getRecent(100);
}

module.exports = {
  init,
  logEvent,
  getRecent,
  replaySample
};
