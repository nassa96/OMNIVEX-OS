/**
 * ATLAS REPLAY BUFFER V1
 * In-memory deterministic event store
 */

const BUFFER = [];
let POINTER = 0;
let PLAYING = true;

/* =========================
   WRITE EVENT
========================= */
export function pushEvent(event) {
  BUFFER.push(event);

  // cap memory
  if (BUFFER.length > 5000) {
    BUFFER.shift();
  }
}

/* =========================
   GET CURRENT FRAME
========================= */
export function getFrame(index) {
  return BUFFER[index] || null;
}

/* =========================
   PLAY CONTROL
========================= */
export function play() {
  PLAYING = true;
}

export function pause() {
  PLAYING = false;
}

export function isPlaying() {
  return PLAYING;
}

/* =========================
   SCRUB
========================= */
export function scrub(index) {
  if (index < 0) index = 0;
  if (index >= BUFFER.length) index = BUFFER.length - 1;

  POINTER = index;

  return BUFFER.slice(0, POINTER);
}

/* =========================
   STATE
========================= */
export function getState() {
  return {
    length: BUFFER.length,
    pointer: POINTER,
    playing: PLAYING
  };
}
