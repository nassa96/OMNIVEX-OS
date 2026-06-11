import { spawn } from "child_process";

function safeRun(name, cmd, cwd) {
  console.log(`[ATLAS BOOT] launching ${name}`);

  const p = spawn(cmd, {
    shell: true,
    cwd,
    stdio: "inherit"
  });

  p.on("error", (err) => {
    console.log(`[ATLAS ERROR] ${name}:`, err.message);
  });

  return p;
}

// IMPORTANT: do NOT duplicate servers
console.log("=== ATLAS SAFE BOOT INIT ===");

// Backend
safeRun(
  "BACKEND",
  "node server.js",
  "/data/data/com.termux/files/home/SAINT_PRIMAL/backend"
);

// Frontend
safeRun(
  "FRONTEND",
  "npm run dev",
  "/data/data/com.termux/files/home/SAINT_PRIMAL/frontend"
);

console.log("=== ATLAS CONTROL PLANE LIVE ===");
