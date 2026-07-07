/**
 * SAINT V83 — LOGGER
 * Structured system logging
 */

class LoggerV83 {

  log(level, message, data = {}) {

    const entry = {
      level,
      message,
      data,
      ts: Date.now()
    };

    console.log("[LOG]", JSON.stringify(entry));
  }

  info(msg, data) {
    this.log("INFO", msg, data);
  }

  error(msg, data) {
    this.log("ERROR", msg, data);
  }
}

module.exports = LoggerV83;
