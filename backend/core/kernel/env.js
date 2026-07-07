/**
 * OMNIVEX SAFE ENV LOADER
 * NO DELETIONS — MERGED PRIORITY SYSTEM
 */

const fs = require("fs");
const path = require("path");

const ROOT_ENV = path.join(__dirname, "../../.env");
const BACKEND_ENV = path.join(__dirname, "../../backend/.env");

function parseEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};

  const raw = fs.readFileSync(filePath, "utf-8");
  const out = {};

  raw.split("\n").forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;

    const idx = trimmed.indexOf("=");
    if (idx === -1) return;

    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();

    out[key] = value;
  });

  return out;
}

function loadEnv() {
  const root = parseEnv(ROOT_ENV);
  const backend = parseEnv(BACKEND_ENV);

  const merged = {
    ...root,
    ...backend,
    ...process.env
  };

  for (const k in merged) {
    process.env[k] = merged[k];
  }

  console.log("[ENV] merged root + backend + runtime env");
}

module.exports = { loadEnv };
