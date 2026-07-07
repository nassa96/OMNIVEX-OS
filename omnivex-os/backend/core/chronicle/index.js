class Chronicle {
  constructor() {
    this.events = [];
  }

  write(event) {
    this.events.push({
      ...event,
      ts: Date.now()
    });

    if (this.events.length > 5000) {
      this.events.shift();
    }
  }

  get() {
    return this.events.slice(-100);
  }
}

module.exports = Chronicle;
