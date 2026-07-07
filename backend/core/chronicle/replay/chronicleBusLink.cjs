const mercuryBus = require("../../market/bus/mercuryBus.cjs");
const chronicle = require("../chronicle.cjs");

class ChronicleBusLink {
  start() {
    console.log("[CHRONICLE] recording active stream");

    mercuryBus.subscribe((event) => {
      chronicle.record({
        type: "MARKET_EVENT",
        data: event
      });
    });
  }
}

module.exports = new ChronicleBusLink();
