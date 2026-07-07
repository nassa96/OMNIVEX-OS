import { getReplay } from "../core/chronicle.js";

let buffer = [];
let index = 0;
let playing = false;

/**
 * LOAD SNAPSHOT FROM CHRONICLE
 */
export function loadReplay() {
  buffer = getReplay() || [];
  index = 0;
}

/**
 * PLAY STATE
 */
export function playReplay() {
  playing = true;
}

export function pauseReplay() {
  playing = false;
}

/**
 * RESET POINTER
 */
export function resetReplay() {
  index = 0;
}

/**
 * STEP ONE EVENT
 */
export function stepReplay() {
  if (!buffer.length || index >= buffer.length) return null;

  const event = buffer[index];
  index += 1;
  return event;
}

/**
 * MAIN REPLAY TICK
 */
export function tickReplay() {
  if (!playing) return null;
  return stepReplay();
}
