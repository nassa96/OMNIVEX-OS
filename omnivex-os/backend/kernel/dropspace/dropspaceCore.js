const eventBus = require("../eventBus");

/**
 * DROPSPACE CORE
 * External signal propagation + viral distribution layer
 */

class DropspaceCore {
  constructor() {
    this.enabled = true;

    this.channels = {
      twitter: true,
      telegram: true,
      discord: true
    };
  }

  init() {
    // Listen to approved executions only
    eventBus.subscribe("saint.execution", (event) => {
      this.broadcast(event);
    });

    // Listen to high confidence signals (pre-execution alpha)
    eventBus.subscribe("sophia.signal", (event) => {
      if ((event.score || event.confidence || 0) > 0.75) {
        this.alphaDrop(event);
      }
    });
  }

  /**
   * Post-execution broadcast (proof layer)
   */
  broadcast(execution) {
    const payload = this.formatExecution(execution);

    if (this.channels.twitter) {
      this.postTwitter(payload);
    }

    if (this.channels.telegram) {
      this.postTelegram(payload);
    }

    if (this.channels.discord) {
      this.postDiscord(payload);
    }
  }

  /**
   * Pre-execution alpha signal drop
   */
  alphaDrop(signal) {
    const payload = {
      type: "ALPHA_SIGNAL",
      message: `⚡ Omnivex Alpha Detected`,
      signal,
      ts: Date.now()
    };

    this.postTwitter(payload);
  }

  formatExecution(execution) {
    return {
      type: "EXECUTION_REPORT",
      message: `SAINT EXECUTED: ${execution.signal?.action || "UNKNOWN"}`,
      confidence: execution.signal?.confidence || execution.confidence,
      ts: Date.now()
    };
  }

  postTwitter(payload) {
    console.log("[DROPSPACE → TWITTER]", JSON.stringify(payload));
  }

  postTelegram(payload) {
    console.log("[DROPSPACE → TELEGRAM]", JSON.stringify(payload));
  }

  postDiscord(payload) {
    console.log("[DROPSPACE → DISCORD]", JSON.stringify(payload));
  }
}

module.exports = new DropspaceCore();
