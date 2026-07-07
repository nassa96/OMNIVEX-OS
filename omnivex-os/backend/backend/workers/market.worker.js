const Mercury = require("../core/mercury");
const { marketQueue } = require("../core/bus/queue");

const mercury = new Mercury();

async function run() {
  setInterval(async () => {
    const data = await mercury.scan();

    await marketQueue.add("tick", {
      data,
      ts: Date.now()
    });

    console.log("[MARKET WORKER] tick pushed");
  }, 2000);
}

run();
