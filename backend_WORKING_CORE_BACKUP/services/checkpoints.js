import fs from "fs";
import path from "path";

const ROOT = process.cwd();

const CHECKPOINT_DIR = path.join(ROOT, "checkpoints");
const HISTORY_DIR = path.join(CHECKPOINT_DIR, "history");
const LATEST_FILE = path.join(CHECKPOINT_DIR, "latest.json");

function ensureDirs() {
  if (!fs.existsSync(CHECKPOINT_DIR)) fs.mkdirSync(CHECKPOINT_DIR);
  if (!fs.existsSync(HISTORY_DIR)) fs.mkdirSync(HISTORY_DIR);
}

export function saveCheckpoint(state) {
  ensureDirs();

  const timestamp = Date.now();
  const file = path.join(HISTORY_DIR, `${timestamp}.json`);

  fs.writeFileSync(file, JSON.stringify(state, null, 2));
  fs.writeFileSync(LATEST_FILE, JSON.stringify(state, null, 2));

  console.log(`[CHECKPOINT SAVED] ${timestamp}`);
}
