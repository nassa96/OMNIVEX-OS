import fs from "fs";
import path from "path";

/**
 * CHRONICLE REPLAY ENGINE
 * - Reads persisted event log
 * - Streams historical market state
 */

const FILE = path.resolve("./backend/data/chronicle.json");

/**
 * LOAD EVENTS
 */
function loadEvents() {
  try {
    const raw = fs.readFileSync(FILE, "utf-8");
    return JSON.parse(raw || "[]");
  } catch {
    return [];
  }
}

/**
 * FILTER RANGE
 */
function filterRange(events, from, to) {
  return events.filter((e) => {
    if (!e.ts) return false;
    if (from && e.ts < from) return false;
    if (to && e.ts > to) return false;
    return true;
  });
}

/**
 * REGISTER ROUTE
 */
export function registerReplayRoute(app) {
  app.get("/replay", (req, res) => {
    const from = Number(req.query.from);
    const to = Number(req.query.to);

    const events = loadEvents();
    const filtered = filterRange(events, from, to);

    res.json({
      count: filtered.length,
      events: filtered,
    });
  });
}
