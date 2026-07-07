/**
 * OMNIVEX PRODUCTION BOOT CONTROLLER
 * Single source of truth startup
 */

const { spawn } = require("child_process");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

function run(cmd, args, cwd) {
  const p = spawn(cmd, args, {
    cwd,
    stdio: "inherit",
    shell: true
  });

  return p;
}

console.log("======================================");
console.log(" OMNIVEX PRODUCTION BOOT MODE");
console.log("======================================");

// 1. BACKEND
const backend = run("node", ["backend/server.cjs"], ROOT);

// 2. FRONTEND
const frontend = run(
  "npm",
  ["run", "dev", "--", "--host", "0.0.0.0"],
  path.join(ROOT, "frontend/app")
);

// 3. GRACEFUL STOP
process.on("SIGINT", () => {
  console.log("\nShutting down OMNIVEX...");
  backend.kill();
  frontend.kill();
  process.exit(0);
});
