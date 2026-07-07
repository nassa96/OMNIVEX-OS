import { startCoinbaseFeed } from "../datafeeds/coinbaseFeed.js";
import { fuseMarketState } from "../fusion/fusionEngine.js";

const STATE = {
  latest: {},
  history: {}
};

export function startMercury(onTick) {
  startCoinbaseFeed((tick) => {
    const packet = processTick(tick);
    onTick(packet);
  });
}

function processTick(tick) {
  const { symbol, price } = tick;

  if (!STATE.history[symbol]) {
    STATE.history[symbol] = [];
  }

  const prev = STATE.latest[symbol] || price;

  STATE.latest[symbol] = price;
  STATE.history[symbol].push(price);

  if (STATE.history[symbol].length > 100) {
    STATE.history[symbol].shift();
  }

  const mercury = {
    symbol,
    price,
    prev,
    history: STATE.history[symbol]
  };

  const fused = fuseMarketState(symbol, mercury, {}, {});

  return {
    mercury,
    fused
  };
}

export function getMercuryState() {
  return STATE;
}
