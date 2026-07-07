const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "../../data/chronicle.json");

function init() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([]));
  }
}

function readAll() {
  init();
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

function append(entry) {
  const data = readAll();

  data.push({
    ts: Date.now(),
    ...entry
  });

  if (data.length > 3000) {
    data.splice(0, data.length - 3000);
  }

  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function tail(n = 200) {
  const data = readAll();
  return data.slice(-n);
}

module.exports = {
  append,
  tail
};
