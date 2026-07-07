const { Worker } = require("bullmq");
const IORedis = require("ioredis");

const Cerberus = require("../core/cerberus");
const Sophia = require("../core/sophia");
const Tartarus = require("../core/tartarus");
const WarEngine = require("../core/war");
const Forge = require("../core/forge");

const connection = new IORedis();

const forge = new Forge();
const war = new WarEngine(forge);

const cer = new Cerberus({}, {});
const sop = new Sophia();
const tar = new Tartarus();

new Worker("market", async job => {
  const market = job.data.data;

  const signals = [
    ...cer.analyze(market),
    ...sop.analyze(market),
    ...tar.disrupt(market)
  ];

  const resolved = war.resolve(signals);

  console.log("[SIGNAL WORKER] resolved:", resolved.length);

  return resolved;
}, { connection });
