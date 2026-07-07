/**
 * SAINT V93 — KILL SWITCH
 */

class KillSwitchV93 {

  constructor() {
    this.enabled = false;
  }

  trigger(reason) {
    this.enabled = true;
    return { shutdown: true, reason };
  }

  status() {
    return { enabled: this.enabled };
  }
}

module.exports = KillSwitchV93;
