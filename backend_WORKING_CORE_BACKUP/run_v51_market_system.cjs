const MercuryBus = require("./core/market/bus/mercuryBusV51.cjs");
const CoinbaseWS = require("./core/market/ingestion/coinbaseWSV51.cjs");
const KrakenWS = require("./core/market/ingestion/krakenWSV51.cjs");

// INIT BUS
const bus = new MercuryBus();

// INIT FEEDS
const coinbase = new CoinbaseWS(bus);
const kraken = new KrakenWS(bus);

// CONNECT STREAMS
coinbase.connect();
kraken.connect();

console.log("[SAINT V51] MARKET INGESTION LAYER ACTIVE");

// =====================================================
// LIVE SNAPSHOT DEBUG LOOP
// =====================================================
setInterval(() => {

  console.log("\n====================");
  console.log("MERCURY SNAPSHOT:");
  console.log(bus.snapshot("ETH-USD"));
  console.log("====================\n");

}, 3000);
