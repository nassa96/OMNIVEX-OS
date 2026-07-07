/**
 * =========================================================
 * CHRONICLE V2 — SQLITE REPLAY MEMORY ENGINE
 * Append-only, RL-ready, corruption-resistant
 * =========================================================
 */

const path = require("path");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();

const DB_PATH = path.join(__dirname, "../../data/chronicle.db");

// Ensure directory exists
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

// Open DB (single persistent connection)
const db = new sqlite3.Database(DB_PATH);

// ===============================
// INIT TABLE (append-only log)
// ===============================
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ts INTEGER,
      type TEXT,
      payload TEXT,
      pnl REAL DEFAULT 0
    )
  `);
});

// ===============================
// WRITE EVENT (SAFE APPEND)
// ===============================
function logEvent(event) {
  return new Promise((resolve, reject) => {
    const ts = Date.now();
    const type = event.type || "TICK";
    const payload = JSON.stringify(event);

    db.run(
      `INSERT INTO events (ts, type, payload, pnl) VALUES (?, ?, ?, ?)`,
      [ts, type, payload, event.pnl || 0],
      function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      }
    );
  });
}

// ===============================
// GET RECENT EVENTS
// ===============================
function getRecent(limit = 100) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM events ORDER BY id DESC LIMIT ?`,
      [limit],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows.reverse());
      }
    );
  });
}

// ===============================
// REPLAY ENGINE (learning backbone)
// ===============================
async function replay() {
  const events = await getRecent(1000);

  let equity = 10000;
  const curve = [];

  for (const e of events) {
    let payload = {};

    try {
      payload = JSON.parse(e.payload);
    } catch {}

    if (e.pnl) equity += e.pnl;

    curve.push({
      ts: e.ts,
      equity,
      type: e.type,
      pnl: e.pnl
    });
  }

  return {
    events,
    curve,
    finalEquity: equity
  };
}

// ===============================
// SIMPLE SIGNAL ANALYTICS (FOR LATER RL)
// ===============================
async function computeStats() {
  const events = await getRecent(500);

  const pnl = events.map(e => e.pnl || 0);
  const total = pnl.reduce((a, b) => a + b, 0);

  const wins = pnl.filter(p => p > 0).length;
  const losses = pnl.filter(p => p < 0).length;

  return {
    totalPnL: total,
    winRate: wins / Math.max(1, wins + losses),
    trades: events.length
  };
}

module.exports = {
  logEvent,
  getRecent,
  replay,
  computeStats
};
