/**
 * OMNIVEX EVENT BUS CORE
 * Deterministic system message router
 */

class EventBus {
  constructor() {
    this.topics = new Map();
    this.history = [];
    this.maxHistory = 500;
  }

  /**
   * Publish an event to the system
   */
  publish(topic, payload) {
    if (!topic) throw new Error("EventBus.publish: missing topic");

    const event = {
      topic,
      payload,
      ts: Date.now()
    };

    // store in replay buffer
    this._record(event);

    const listeners = this.topics.get(topic);

    if (!listeners || listeners.length === 0) return;

    for (const fn of listeners) {
      try {
        fn(event.payload, event);
      } catch (err) {
        console.error(`EventBus handler error [${topic}]`, err);
      }
    }
  }

  /**
   * Subscribe to a topic
   */
  subscribe(topic, handler) {
    if (!topic || typeof handler !== "function") {
      throw new Error("EventBus.subscribe: invalid args");
    }

    if (!this.topics.has(topic)) {
      this.topics.set(topic, []);
    }

    const listeners = this.topics.get(topic);

    listeners.push(handler);

    return () => this.unsubscribe(topic, handler);
  }

  /**
   * Remove listener
   */
  unsubscribe(topic, handler) {
    const listeners = this.topics.get(topic);
    if (!listeners) return;

    this.topics.set(
      topic,
      listeners.filter(h => h !== handler)
    );
  }

  /**
   * Replay system events (Chronicle integration)
   */
  replay(limit = 50) {
    return this.history.slice(-limit);
  }

  /**
   * Internal event log
   */
  _record(event) {
    this.history.push(event);

    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
  }

  /**
   * Debug state
   */
  debug() {
    return {
      topics: [...this.topics.keys()],
      listeners: [...this.topics.entries()].map(([k, v]) => ({
        topic: k,
        count: v.length
      })),
      historySize: this.history.length
    };
  }
}

// singleton
const eventBus = new EventBus();

module.exports = eventBus;
