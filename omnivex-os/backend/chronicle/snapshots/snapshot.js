import fs from "fs";
import path from "path";

/**
 * SNAPSHOT ENGINE
 * freezes system state at a moment in time
 */

const SNAP_DIR = path.resolve(process.cwd(), "backend/chronicle/snapshots");

if (!fs.existsSync(SNAP_DIR)) {
  fs.mkdirSync(SNAP_DIR, { recursive: true });
}

export function createSnapshot(state) {
  const file = path.join(
    SNAP_DIR,
    `snapshot-${Date.now()}.json`
  );

  fs.writeFileSync(file, JSON.stringify(state, null, 2));

  return file;
}
