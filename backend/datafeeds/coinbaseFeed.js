const SYMBOLS = ["BTC", "ETH", "SOL"];

const STATE = {
BTC: 76000,
ETH: 4200,
SOL: 220
};

export function startCoinbaseFeed(onTick) {
setInterval(() => {
const symbol =
SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

const drift = (Math.random() - 0.5) * 0.01;

STATE[symbol] = STATE[symbol] * (1 + drift);

onTick({
  exchange: "COINBASE",
  symbol,
  price: Number(STATE[symbol].toFixed(2)),
  timestamp: Date.now()
});

}, 1000);
}
