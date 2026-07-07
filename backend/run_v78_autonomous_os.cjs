const MarketStream = require("./core/stream/realtime/marketStreamV76.cjs");
const StreamSync = require("./core/stream/sync/streamSyncV76.cjs");

const Postgres = require("./core/database/postgres/postgresClientV77.cjs");
const EventLedger = require("./core/database/events/eventLedgerV77.cjs");
const TradeLedger = require("./core/database/ledger/tradeLedgerV77.cjs");

const Kernel = require("./core/os/kernel/saintKernelV78.cjs");

console.log("[SAINT V78] AUTONOMOUS OS INITIALIZING");

// =====================================================
// SYSTEM WIRING
// =====================================================
const stream = new MarketStream();
const sync = new StreamSync();

const db = new Postgres();

const eventLedger = new EventLedger(db);
const tradeLedger = new TradeLedger(db);

// fake executor
const executor = {
  execute: async (signal) => {
    return {
      executed: true,
      ...signal,
      ts: Date.now()
    };
  }
};

const kernel = new Kernel({
  stream,
  ledger: eventLedger,
  executor
});

// =====================================================
// STREAM LOOP
// =====================================================
setInterval(async () => {

  const raw = {
    symbol: "BTCUSDT",
    price: Math.random() * 80000,
    volume: Math.random() * 10
  };

  const update = sync.sync(raw);

  if (!update) return;

  const result = await kernel.tick(update);

  console.log("\n====================");
  console.log("MARKET:", result.market);
  console.log("SIGNAL:", result.signal);
  console.log("EXEC:", result.result);
  console.log("====================\n");

}, 3000);
