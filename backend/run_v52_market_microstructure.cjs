const MercuryBus = require("./core/market/bus/mercuryBusV52.cjs");
const BinanceUS = require("./core/market/ingestion/binanceUSWSV52.cjs");

const bus = new MercuryBus();
const binance = new BinanceUS(bus);

binance.connect();

console.log("[SAINT V52] LIQUIDITY ENGINE ACTIVE");

setInterval(() => {

  console.log("\n====================");
  console.log("MICROSTRUCTURE SNAPSHOT:");
  console.log(bus.snapshot("ETH-USD"));
  console.log("====================\n");

}, 3000);
