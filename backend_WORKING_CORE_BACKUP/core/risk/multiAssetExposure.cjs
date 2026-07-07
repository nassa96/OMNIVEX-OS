class MultiAssetExposureController {
  constructor(capital = 10000) {
    this.capital = capital;
    this.exposure = {}; // symbol -> exposure value
  }

  update(symbol, value) {
    this.exposure[symbol] = (this.exposure[symbol] || 0) + value;
  }

  getTotalExposure() {
    return Object.values(this.exposure).reduce((a, b) => a + b, 0);
  }

  getExposureRatio() {
    return this.getTotalExposure() / this.capital;
  }

  allowTrade(symbol, proposedSize, price) {
    const tradeValue = proposedSize * price;
    const projected = this.getTotalExposure() + tradeValue;

    // hard cap at 60% of capital
    if (projected / this.capital > 0.6) {
      return false;
    }

    // per-symbol cap at 25%
    const symbolExposure = this.exposure[symbol] || 0;
    if ((symbolExposure + tradeValue) / this.capital > 0.25) {
      return false;
    }

    return true;
  }
}

module.exports = MultiAssetExposureController;
