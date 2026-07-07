function validateSignal(signal) {
  if (!signal) return { valid: false, error: "NULL_SIGNAL" };

  const required = ["symbol", "price", "side", "confidence"];

  for (const field of required) {
    if (signal[field] === undefined || signal[field] === null) {
      return {
        valid: false,
        error: `MISSING_FIELD_${field.toUpperCase()}`
      };
    }
  }

  if (!["BUY", "SELL", "HOLD"].includes(signal.side)) {
    return { valid: false, error: "INVALID_SIDE" };
  }

  if (signal.confidence < 0 || signal.confidence > 1) {
    return { valid: false, error: "INVALID_CONFIDENCE_RANGE" };
  }

  if (typeof signal.price !== "number") {
    return { valid: false, error: "INVALID_PRICE_TYPE" };
  }

  return { valid: true };
}

module.exports = { validateSignal };
