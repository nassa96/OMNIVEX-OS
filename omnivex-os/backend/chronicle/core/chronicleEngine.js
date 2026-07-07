const memory = [];

function record(event) {
  memory.push(event);

  // cap memory size (prevent Termux overload)
  if (memory.length > 500) memory.shift();
}

function getHistory() {
  return memory.slice().reverse();
}

module.exports = {
  record,
  getHistory
};
