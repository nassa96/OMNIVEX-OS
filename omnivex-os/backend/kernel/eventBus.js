import { EventEmitter } from "events";

export function initEventBus() {
  const bus = new EventEmitter();

  // Safe emit wrapper (prevents undefined crashes)
  bus.emitEvent = (type, payload = {}) => {
    const event = {
      id: crypto.randomUUID(),
      type,
      payload,
      ts: Date.now()
    };

    bus.emit(type, event);
  };

  return bus;
}
