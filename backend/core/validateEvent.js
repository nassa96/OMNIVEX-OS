export function validateEvent(event) {
  if (!event) return false;

  if (!event.signal || !event.risk || !event.market) {
    return false;
  }

  if (typeof event.market.BTC !== "number") return false;
  if (typeof event.market.prevBTC !== "number") return false;

  return true;
}
