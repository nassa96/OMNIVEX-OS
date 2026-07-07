const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "../runtime");
const FILE_PATH = path.join(DATA_DIR, "chronicle.jsonl");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function write(entry) {
  fs.appendFileSync(FILE_PATH, JSON.stringify(entry) + "\n");
  return entry;
}

function read(limit = 100) {
  if (!fs.existsSync(FILE_PATH)) return [];

  return fs
    .readFileSync(FILE_PATH, "utf-8")
    .trim()
    .split("\n")
    .filter(Boolean)
    .map(JSON.parse)
    .slice(-limit);
}

module.exports = { write, read };
