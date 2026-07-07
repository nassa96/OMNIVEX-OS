/**
 * =========================================================
 * CHRONICLE FILE-BASED REPLAY ENGINE (NO SQLITE)
 * Event-sourced persistent memory layer for Omnivex OS
 * =========================================================
 *
 * Storage model:
 * - Append-only JSONL file
 * - Each tick = one line
 * - Replay = streaming read
 */

const fs = require("fs");
const path = require("path");

// ===============================
// STORAGE LOCATION
// ===============================
const DATA_DIR = path.join(__dirname, "../../data/chronicle");
const LOG_FILE = path.join(DATA_DIR, "chronicle.jsonl");

// ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// ===============================
// WRITE EVENT (APPEND-ONLY)
// ===============================
function log(event) {
  try {
    const line = JSON.stringify({
      ...event,
      ts: Date.now()
    });

    fs.appendFileSync(LOG_FILE, line + "\n");
  } catch (err) {
    console.warn("[CHRONICLE] write failed:", err.message);
  }
}

// ===============================
// REPLAY ENGINE
// ===============================
function replay(limit = 100) {
  try {
    if (!fs.existsSync(LOG_FILE)) return [];

    const raw = fs.readFileSync(LOG_FILE, "utf-8").trim();
    if (!raw) return [];

    const lines = raw.split("\n").slice(-limit);

    return lines.map(line => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    }).filter(Boolean);

  } catch (err) {
    console.warn("[CHRONICLE] replay failed:", err.message);
    return [];
  }
}

// ===============================
// CLEAR HISTORY (OPTIONAL)
// ===============================
function clear() {
  try {
    fs.writeFileSync(LOG_FILE, "");
  } catch (err) {
    console.warn("[CHRONICLE] clear failed:", err.message);
  }
}

module.exports = {
  log,
  replay,
  clear
};
