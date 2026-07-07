import { broadcast } from "./wsServer.js";
import { emitEvent } from "../chronicle/eventAdapter.js";

/**
 * CHRONICLE STREAM ADAPTER
 * Ensures all system events are:
 * 1. persisted
 * 2. broadcast live to ATLAS
 */

export function streamEvent(event = {}) {
  // 1. persist into CHRONICLE
  const stored = emitEvent(event);

  // 2. push to frontend stream
  broadcast({
    ...stored,
    stream: "CHRONICLE"
  });

  return stored;
}
