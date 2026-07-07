/**
 * CHRONICLE LEDGER V1
 * Immutable event log + idempotency guard
 */

const EVENTS = new Map();

export function appendEvent(event) {
  const key = event.orderId + ":" + event.type;

  if (EVENTS.has(key)) {
    return {
      status: "DUPLICATE_EVENT_BLOCKED",
      key
    };
  }

  EVENTS.set(key, {
    ...event,
    timestamp: Date.now()
  });

  return {
    status: "RECORDED",
    event
  };
}

export function getEvents() {
  return Array.from(EVENTS.values());
}
