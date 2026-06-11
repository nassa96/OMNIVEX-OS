import { getMarketData } from "../services/marketFeed.js";
import { Sophia } from "../engines/sophia.js";
import { Elohim } from "../engines/elohim.js";
import { Saint } from "../engines/saint.js";
import { Aegis } from "../engines/aegis.js";

const memory = new Elohim();

export function attachStream(wss) {
  console.log("ATLAS STREAM ENGINE ONLINE");

  setInterval(async () => {
    try {
      const tick = await getMarketData();

      if (!tick || !tick.btc) return;

      const analysis = Sophia(tick, memory.getHistory());

      memory.push(tick, analysis);
      memory.updateState(analysis.signal, tick.btc);

      const saint = Saint(memory.state, tick.btc);
      const aegis = Aegis(memory.state, tick.btc, analysis.signal);

      const payload = {
        type: "atlas_signal",
        data: {
          price: tick.btc,
          signal: aegis.signalOverride,
          roi: saint.roi || 0,
          risk: aegis.riskLevel,
          positionSize: aegis.positionSize,
          momentum: analysis.momentum,
          avg: analysis.avg,
          timestamp: Date.now()
        }
      };

      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(JSON.stringify(payload));
        }
      });

    } catch (err) {
      console.log("STREAM ERROR:", err.message);
    }

  }, 2000);
}
