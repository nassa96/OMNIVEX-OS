/**
 * SAINT V91 — POSITION LIMIT ENFORCER
 */

class PositionLimitV91 {

  constructor(maxExposure = 0.3) {
    this.maxExposure = maxExposure;
  }

  validate(order) {

    if (order.exposure > this.maxExposure) {
      return {
        allowed: false,
        reason: "EXPOSURE_LIMIT_EXCEEDED"
      };
    }

    return { allowed: true };
  }
}

module.exports = PositionLimitV91;
