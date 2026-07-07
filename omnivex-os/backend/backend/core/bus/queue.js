const { Queue } = require("bullmq");
const IORedis = require("ioredis");

const connection = new IORedis({
  maxRetriesPerRequest: null
});

const marketQueue = new Queue("market", { connection });
const signalQueue = new Queue("signals", { connection });
const executionQueue = new Queue("execution", { connection });

module.exports = {
  marketQueue,
  signalQueue,
  executionQueue
};
EOFmkdir -p backend/core/bus

cat > backend/core/bus/queue.js << 'EOF'
const { Queue } = require("bullmq");
const IORedis = require("ioredis");

const connection = new IORedis({
  maxRetriesPerRequest: null
});

const marketQueue = new Queue("market", { connection });
const signalQueue = new Queue("signals", { connection });
const executionQueue = new Queue("execution", { connection });

module.exports = {
  marketQueue,
  signalQueue,
  executionQueue
};
