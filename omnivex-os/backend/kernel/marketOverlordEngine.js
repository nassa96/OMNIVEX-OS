/**
 * OMNIVEX OS — MARKET OVERLORD ENGINE v1
 * Multi-venue intelligence + arbitrage + memecoin micro-detection layer
 */

export function createMarketOverlordEngine({ bus, chronicle, state } = {}) {
  if (!bus) throw new Error("Bus required for market overlord engine");

  /**
   * =========================
   * VENUE PRICES (SIMULATED MULTI-EXCHANGE FEED)
   * =========================
   */

  const venues = {
    hyperliquid: {},
    avantis: {},
    polygon: {},
    coinbase: {},
    binance: {}
  };

  /**
   * =========================
   * MEME MICRO DETECTOR
   * =========================
   */

  function detectMeme(event) {
    const raw = JSON.stringify(event || {}).toLowerCase();

    const tokens = ["pepe", "doge", "shib", "elon", "moon", "pump", "launch"];

    let score = 0;

    for (const t of tokens) {
      if (raw.includes(t)) score++;
    }

    return score;
  }

  /**
   * =========================
   * PRICE UPDATE
   * =========================
   */

  function updateVenue(venue, symbol, price) {
    venues[venue][symbol] = price;
  }

  /**
   * =========================
   * ARBITRAGE DETECTOR
   * =========================
   */

  function detectArbitrage(symbol) {
    const prices = Object.entries(venues)
      .map(([venue, data]) => ({
        venue,
        price: data[symbol]
      }))
      .filter((x) => x.price != null);

    if (prices.length < 2) return null;

    let min = prices[0];
    let max = prices[0];

    for (const p of prices) {
      if (p.price < min.price) min = p;
      if (p.price > max.price) max = p;
    }

    const spread = max.price - min.price;

    return {
      symbol,
      buy: min,
      sell: max,
      spread
    };
  }

  /**
   * =========================
   * ROUTING DECISION
   * =========================
   */

  function route(event) {
    const symbol = event?.data?.asset || "BTC";

    const memeScore = detectMeme(event);
    const arb = detectArbitrage(symbol);

    let priority = "NORMAL";
    let venue = "coinbase";

    /**
     * MEME SPIKE LOGIC
     */
    if (memeScore >= 3) {
      priority = "MEME_RUN";
      venue = "hyperliquid";
    }

    /**
     * ARBITRAGE LOGIC
     */
    if (arb && arb.spread > 50) {
      priority = "ARBITRAGE";
      venue = arb.buy.venue;
    }

    /**
     * HIGH VOLATILITY ESCAPE
     */
    if (memeScore >= 5) {
      venue = "avantis";
    }

    const decision = {
      type: "market.overlord.route",

      ts: Date.now(),

      symbol,

      venue,

      priority,

      memeScore,

      arbitrage: arb
    };

    bus.emit(decision.type, decision);

    chronicle?.append?.(decision);

    return decision;
  }

  /**
   * =========================
   * EVENT LISTENER
   * =========================
   */

  bus.onAny((event) => {
    if (!event) return;

    if (event.type === "market.tick") {
      const venue = event.data?.venue || "coinbase";
      const symbol = event.data?.asset || "BTC";
      const price = event.data?.price;

      updateVenue(venue, symbol, price);

      route(event);
    }
  });

  return {
    getVenues: () => venues
  };
}
