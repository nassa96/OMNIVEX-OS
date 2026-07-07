const EventEmitter = require("events");

class Bus extends EventEmitter {
  emitTick(data) {
    this.emit("tick", data);
  }

  emitBook(book) {
    this.emit("book", book);
  }

  emitSignal(signal) {
    this.emit("signal", signal);
  }
}

module.exports = new Bus();
