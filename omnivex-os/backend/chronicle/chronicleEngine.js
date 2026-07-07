const memory = [];

function record(event) {
  memory.push(event);

  if (memory.length > 1000) {
    memory.shift();
  }
}

function getMemory() {
  return memory;
}

module.exports = { record, getMemory };
