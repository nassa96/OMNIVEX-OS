const LiquiditySnapshot = require("../state/liquiditySchema.cjs");
const LiquidityNormalizer = require("../normalizer/liquidityNormalizer.cjs");
const OrderbookFusion = require("../fusion/orderbookFusion.cjs");
const MicrostructureEngine = require("../microstructure/microstructureEngine.cjs");

class LiquidityHubV4 {

  constructor(adapters) {
    this.state = new LiquiditySnapshot();
    this.norm = new LiquidityNormalizer();
    this.fusion = new OrderbookFusion();
    this.micro = new MicrostructureEngine();
    this.adapters = adapters;
  }

  start() {

    console.log("[LIQUIDITY HUB V4] microstructure prediction online...");

    const ingest = (book) => {
      this.state.updateExchange(book.venue, book);
      this.fusion.ingest(book);
    };

    // ---------------------------
    // CEX FEEDS
    // ---------------------------
    this.adapters.binance.connect((data) => {
      ingest(this.norm.fromBinance(data));
    });

    this.adapters.coinbase.connect((data) => {
      ingest(this.norm.fromCoinbase(data));
    });

    // ---------------------------
    // ONCHAIN FEEDS
    // ---------------------------
    this.adapters.ethereum.poll((data) => {
      this.state.updateChain("ethereum", this.norm.fromChain(data));
    });

    this.adapters.arbitrum.poll((data) => {
      this.state.updateChain("arbitrum", this.norm.fromChain(data));
    });

    this.adapters.tron.poll((data) => {
      this.state.updateChain("tron", this.norm.fromChain(data));
    });

    // ---------------------------
    // PREDICTION LOOP
    // ---------------------------
    setInterval(() => {

      const spread = this.fusion.getSpread();
      const depth = this.fusion.getDepthScore();

      const prediction = this.micro.predict({
        spread,
        depth
      });

      console.log("[SAINT MICROSTRUCTURE]", prediction);

      // reset per tick frame
      this.fusion.reset();

    }, 2000);
  }
}

module.exports = LiquidityHubV4;
