let buffer = [];
let lastFlush = Date.now();

export function pushEvent(event) {
  buffer.push(event);
}

export function flushBuffer({ maxSize = 5, interval = 1000 } = {}) {
  const now = Date.now();

  if (buffer.length === 0) return [];

  const shouldFlush =
    buffer.length >= maxSize || (now - lastFlush) >= interval;

  if (!shouldFlush) return [];

  const batch = buffer;
  buffer = [];
  lastFlush = now;

  return batch;
}
