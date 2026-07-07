const fs = require("fs");
const path = require("path");

const FILE_PATH = path.join(__dirname, "../../data/chronicle.jsonl");

function write(event) {
  const entry = {
    ts: Date.now(),
    ...event
  };

  fs.appendFileSync(FILE_PATH, JSON.stringify(entry) + "\n");
  return entry;
}

function read(limit = 100) {
  if (!fs.existsSync(FILE_PATH)) return [];

  const raw = fs.readFileSync(FILE_PATH, "utf-8")
    .trim()
    .split("\n")
    .filter(Boolean)
    .map(JSON.parse);

  return raw.slice(-limit);
}

module.exports = {
  write,
  read
};
