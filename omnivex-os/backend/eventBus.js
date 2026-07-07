class EventBus {
  constructor() {
    this.channels = {};
  }

  subscribe(event, handler) {
    if (!this.channels[event]) {
      this.channels[event] = [];
    }
    this.channels[event].push(handler);
  }

  publish(event, data) {
    const subs = this.channels[event];
    if (!subs) return;

    subs.forEach(fn => fn(data));
  }
}

module.exports = new EventBus();
