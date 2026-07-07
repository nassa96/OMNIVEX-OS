import crypto from "crypto";

/**
 * OMNIVEX OS PRIME — CHRONICLE CORE
 * Immutable event store (append-only)
 */

export function createChronicle() {
  const store = [];

  function append(event) {
    const record = {
      id: event.id || crypto.randomUUID(),
      type: event.type,
      source: event.source || "unknown",
      timestamp: event.timestamp || Date.now(),
      payload: event.payload || {},
    };

    store.push(record);

    return record;
  }

  function getAll() {
    return [...store];
  }

  function query(filterFn) {
    return store.filter(filterFn);
  }

  function clear() {
    // DISABLED IN PRODUCTION — safety lock
    throw new Error("CHRONICLE IS IMMUTABLE");
  }

  return {
    append,
    getAll,
    query
  };
}
