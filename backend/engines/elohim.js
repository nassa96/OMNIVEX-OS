let history = [];

export function elohim(price) {
  history.push(price);
  if (history.length > 20) history.shift();

  const avg = history.reduce((a, b) => a + b, 0) / history.length;

  return { history, avg };
}
