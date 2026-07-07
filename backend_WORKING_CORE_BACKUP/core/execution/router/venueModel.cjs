/**
 * SAINT V12 — VENUE MODEL
 * Normalized exchange execution profile
 */

class VenueModel {

  constructor(data) {
    this.name = data.name;

    this.liquidity = data.liquidity || 0;
    this.spread = data.spread || 0;
    this.mid = data.mid || 1;

    this.latency = data.latency || 0;

    this.estimatedSlippage = data.estimatedSlippage || 0.2;
    this.fillProbability = data.fillProbability || 0.5;

    this.bias = data.bias || 0;
  }

  static buildFromMarket(exchangeData) {

    return new VenueModel({
      name: exchangeData.venue,
      liquidity: exchangeData.depth?.totalDepth || 0,
      spread: exchangeData.spread?.spread || 0,
      mid: exchangeData.spread?.mid || 1,
      latency: exchangeData.latency || 0,
      estimatedSlippage: exchangeData.slippage || 0.2,
      fillProbability: exchangeData.fillProb || 0.5,
      bias: exchangeData.bias || 0
    });
  }
}

module.exports = VenueModel;
