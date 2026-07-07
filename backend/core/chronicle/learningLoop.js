const memory = [];

function record(entry) {
  memory.push(entry);

  if (memory.length > 500) {
    memory.shift();
  }
}

function getHistory() {
  return memory;
}

export { record, getHistory };
