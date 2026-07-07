const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "../data/chronicle.log");

function write(entry) {
  fs.appendFileSync(FILE, JSON.stringify(entry) + "\n");
}

function read(limit = 100) {
  if (!fs.existsSync(FILE)) return [];

  return fs
    .readFileSync(FILE, "utf-8")
    .trim()
    .split("\n")
    .filter(Boolean)
    .map(JSON.parse)
    .slice(-limit);
}

module.exports = { write, read };
