let last = 0;

export function createTelemetry() {
  return {
    logHealth(msg, data = {}) {
      const now = Date.now();

      // HARD THROTTLE (no exceptions)
      if (now - last < 2500) return;

      last = now;

      console.log(
        `[HEALTH] ${msg}`,
        Object.keys(data).length ? data : ""
      );
    }
  };
}
