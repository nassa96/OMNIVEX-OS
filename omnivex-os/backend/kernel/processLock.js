import fs from "fs";
import path from "path";

const LOCK_FILE = path.resolve("./.omnivex.lock");

export function acquireLock() {
  if (fs.existsSync(LOCK_FILE)) {
    const pid = fs.readFileSync(LOCK_FILE, "utf-8");

    try {
      process.kill(Number(pid), 0);
      console.log("[LOCK] OMNIVEX already running (PID:", pid, ")");
      process.exit(1);
    } catch {
      console.log("[LOCK] Stale lock removed");
      fs.unlinkSync(LOCK_FILE);
    }
  }

  fs.writeFileSync(LOCK_FILE, String(process.pid));
  console.log("[LOCK] ACQUIRED:", process.pid);

  process.on("exit", releaseLock);
  process.on("SIGINT", () => {
    releaseLock();
    process.exit(0);
  });
}

export function releaseLock() {
  if (fs.existsSync(LOCK_FILE)) {
    fs.unlinkSync(LOCK_FILE);
    console.log("[LOCK] RELEASED");
  }
}
