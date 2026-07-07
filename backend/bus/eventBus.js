export const EventBus = {
  listeners: {},

  on(event, fn) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(fn);
  },

  emit(event, data) {
    const subs = this.listeners[event] || [];

    for (const fn of subs) {
      fn(data);
    }
  }
};
