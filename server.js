/**
 * SAINT PRIMAL — ROOT BOOT DELEGATE
 * DO NOT IMPLEMENT LOGIC HERE
 */

const path = require("path");
const { spawn } = require("child_process");

// Always forward execution to backend kernel
const backend = path.join(__dirname, "backend", "server.cjs");

console.log("==================================");
console.log(" SAINT PRIMAL BOOT DELEGATE");
console.log(" Forwarding to backend kernel...");
console.log("==================================");

const proc = spawn("node", [backend], {
  stdio: "inherit"
});

proc.on("exit", (code) => {
  console.log("Kernel exited with code:", code);
});
