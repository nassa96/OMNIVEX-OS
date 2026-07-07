const { Worker } = require("bullmq");
const IORedis = require("ioredis");

const Saint = require("../core/saint");
const Aegis = require("../core/aegis");
const Forge = require("../core/forge");
const Chronicle = require("../core/chronicle");

const connection = new IORedis();

const forge = new Forge();
const chronicle = new Chronicle();
const saint = new Saint(forge, chronicle);
const aegis = new Aegis(forge);

new Worker("signals", async job => {
  const decision = job.data;

  const risk = aegis.evaluate(decision, saint);

  const result = saint.execute(decision, [], risk);

  console.log("[EXECUTION WORKER]", result.blocked ? "BLOCKED" : "EXECUTED");

  return result;
}, { connection });
