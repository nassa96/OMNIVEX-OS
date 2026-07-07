/**
 * OMNIVEX EVENT BUS (CORE KERNEL LAYER)
 * FIXED: EventEmitter-based pub/sub system
 */

const EventEmitter = require("events");

class EventBus extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(1000);
  }

  /**
   * Publish event to system
   */
  publish(eventType, payload) {
    const event = {
      type: eventType,
      ...payload,
      ts: Date.now()
    };

    this.emit(eventType, event);
    this.emit("*", event); // global stream

    return event;
  }

  /**
   * Subscribe to event stream
   */
  subscribe(eventType, handler) {
    this.on(eventType, handler);

    return () => {
      this.off(eventType, handler);
    };
  }

  /**
   * One-time subscription
   */
  once(eventType, handler) {
    this.once(eventType, handler);
  }

  /**
   * Debug helper
   */
  debug(handler) {
    this.on("*", handler);
  }
}

module.exports = new EventBus();
