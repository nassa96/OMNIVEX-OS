import { EventEmitter } from "events";

export const bus = new EventEmitter();

/**
 * CENTRAL EVENT BUS
 * Decouples:
 * - signals (SOPHIA)
 * - risk (AEGIS)
 * - decisions (ELOHIM)
 * - execution (SAINT)
 */

export function emitEvent(type, payload) {
  bus.emit(type, payload);
}

export function onEvent(type, handler) {
  bus.on(type, handler);
}
