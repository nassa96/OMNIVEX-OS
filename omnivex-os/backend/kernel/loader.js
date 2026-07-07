// backend/kernel/loader.js

import sophia from "../agents/sophia.js";
import prometheus from "../agents/prometheus.js";
import aegis from "../agents/aegis.js";
import saint from "../agents/saint.js";
import tartarus from "../agents/tartarus.js";
import asclepius from "../agents/asclepius.js";
import argus from "../agents/argus.js";

/**
 * OMNIVEX AGENT LOADER
 * - all agents receive shared bus
 */

export function loadAgents(bus) {
  return {
    sophia: sophia(bus),
    prometheus: prometheus(bus),
    aegis: aegis(bus),
    saint: saint(bus),
    tartarus: tartarus(bus),
    asclepius: asclepius(bus),
    argus: argus(bus)
  };
}
