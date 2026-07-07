class Chronicle {
  constructor() {
    this.events = [];
  }

  write(event) {
    if (!event) return;

    const entry = this.normalize(event);
    this.events.push(entry);

    console.log("[CHRONICLE]", entry.type, entry.symbol || "SYS");
  }

  normalize(event) {
    return {
      id: this.generateId(),
      timestamp: Date.now(),
      type: event.type || "UNKNOWN",
      symbol: event.symbol || null,
      payload: event.payload || event,
      source: event.source || "system",
      metadata: event.metadata || {}
    };
  }

  replay(filterFn = null) {
    if (!filterFn) return this.events;
    return this.events.filter(filterFn);
  }

  snapshot() {
    return {
      totalEvents: this.events.length,
      lastEvent: this.events[this.events.length - 1] || null
    };
  }

  generateId() {
    return "CHR_" + Math.random().toString(36).substring(2, 10).toUpperCase();
  }
}

module.exports = new Chronicle();
