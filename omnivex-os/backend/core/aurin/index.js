class Aurin {
  route(signal) {
    if (signal.override) return "TARTARUS";
    if (signal.confidence > 0.7) return "CERBERUS";
    return "SOPHIA";
  }
}

module.exports = Aurin;
