const BinanceWS = require("../../exchange/ws/binance/binanceWSV79.cjs");
const CoinbaseWS = require("../../exchange/ws/coinbase/coinbaseWSV79.cjs");
const MarketStream = require("../../stream/realtime/marketStreamV76.cjs");

const Redis = require("../../infrastructure/redis/client/redisClientV80.cjs");
const RedisStream = require("../../infrastructure/redis/streams/redisStreamV80.cjs");

const Postgres = require("../../database/postgres/client/postgresClientV80.cjs");
const Normalizer = require("../../exchange/normalizer/exchangeNormalizerV79.cjs");

console.log("[SAINT V81] FULL AUTONOMOUS SYSTEM BOOTING");

// =====================================================
// CORE SERVICES
// =====================================================
const stream = new MarketStream();
const redis = new Redis();
const redisStream = new RedisStream(redis);

const db = new Postgres();
const normalize = new Normalizer();

// =====================================================
// WS FEEDS
// =====================================================
const binance = new BinanceWS(stream);
const coinbase = new CoinbaseWS(stream);

binance.connect();
coinbase.connect();

// =====================================================
// STREAM PROCESSOR
// =====================================================
stream.subscribe(async (tick) => {

  const clean = normalize.normalize(tick);

  redisStream.publish("ticks", clean);

  await db.insert("events", clean);

  console.log("[V81 TICK]", clean);
});
