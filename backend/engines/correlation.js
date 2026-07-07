const history = {
  BTC: [],
  ETH: [],
  SOL: []
};

const WINDOW = 30;

function push(symbol, price) {
  if (!history[symbol]) history[symbol] = [];
  history[symbol].push(price);

  if (history[symbol].length > WINDOW) {
    history[symbol].shift();
  }
}

function returns(arr) {
  const r = [];
  for (let i = 1; i < arr.length; i++) {
    r.push((arr[i] - arr[i - 1]) / arr[i - 1]);
  }
  return r;
}

function correlation(a, b) {
  const n = Math.min(a.length, b.length);
  if (n < 5) return 0;

  const ar = returns(a.slice(-n));
  const br = returns(b.slice(-n));

  const meanA = ar.reduce((x, y) => x + y, 0) / ar.length;
  const meanB = br.reduce((x, y) => x + y, 0) / br.length;

  let num = 0;
  let da = 0;
  let db = 0;

  for (let i = 0; i < ar.length; i++) {
    const aDiff = ar[i] - meanA;
    const bDiff = br[i] - meanB;

    num += aDiff * bDiff;
    da += aDiff * aDiff;
    db += bDiff * bDiff;
  }

  return num / (Math.sqrt(da) * Math.sqrt(db) + 1e-9);
}

export function updateCorrelation(signal) {
  push(signal.symbol, signal.price);

  return {
    BTC_ETH: correlation(history.BTC, history.ETH),
    BTC_SOL: correlation(history.BTC, history.SOL),
    ETH_SOL: correlation(history.ETH, history.SOL)
  };
}
