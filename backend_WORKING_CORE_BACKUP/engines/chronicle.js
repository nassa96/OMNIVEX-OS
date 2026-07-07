/**
 * CHRONICLE V2
 * Deterministic event memory + replay engine
 */

const MEMORY = [];

/* =========================
   WRITE EVENT
========================= */
export function writeChronicle(event) {
  MEMORY.push({
    ts: event.ts || Date.now(),
    data: structuredClone(event)
  });
}

/* =========================
   FULL REPLAY
========================= */
export function replayChronicle() {
  return MEMORY;
}

/* =========================
   TIME RANGE REPLAY
========================= */
export function replayRange(startTs, endTs) {
  return MEMORY.filter(
    (e) => e.ts >= startTs && e.ts <= endTs
  );
}

/* =========================
   CLEAR MEMORY
========================= */
export function clearChronicle() {
  MEMORY.length = 0;
}

/* =========================
   SNAPSHOT STATE RECONSTRUCTION
========================= */
export function reconstructState(index) {
  return MEMORY.slice(0, index + 1);
}
