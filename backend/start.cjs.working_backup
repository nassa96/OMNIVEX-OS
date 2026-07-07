const mercuryBus = require("./core/market/bus/mercuryBus.cjs");
const CEXFeeds = require("./core/market/feeds/cex/startCexFeeds.cjs");
const saintRouter = require("./core/saint/router/saintRouter.cjs");
const chronicle = require("./core/chronicle/chronicle.cjs");
const sophia = require("./core/sophia/sophiaBridge.cjs");

console.log("[BOOT] SAINT PRIME SYSTEM");


// =========================
// MERCURY → CHRONICLE
// =========================

mercuryBus.subscribe(event => {

    chronicle.write(event);

});

console.log("[CHRONICLE] MEMORY LINKED");


// =========================
// MERCURY → SOPHIA
// =========================

sophia.connect(mercuryBus);


// =========================
// MARKET FEEDS
// =========================

const feeds = new CEXFeeds(mercuryBus);

feeds.start();


// =========================
// EXECUTION ROUTER
// =========================

saintRouter.start();


console.log("[SYSTEM] ALL MODULES ONLINE");


// =========================
// HTTP SERVER
// =========================

require("./server.js");

