/**
 * OMNIVEX OS PRIME
 * KERNEL REGISTRY
 * SINGLE SOURCE OF SYSTEM INTROSPECTION
 */

const SYSTEM_REGISTRY = {
  agents: {},
  engines: {},
  services: {},
  metadata: {},
  bus: null
};

/**
 * CORE REGISTRATION ENTRYPOINT
 * This is what server.js expects
 */
export function registerCore(bus, payload = {}) {
  SYSTEM_REGISTRY.bus = bus;

  SYSTEM_REGISTRY.metadata = {
    env: payload.env || {},
    timestamp: Date.now()
  };

  SYSTEM_REGISTRY.agents = payload.agents || {};
  SYSTEM_REGISTRY.engines = payload.engines || {};
  SYSTEM_REGISTRY.services = {
    ledger: payload.ledger || null,
    chronicle: payload.chronicle || null
  };

  /**
   * Emit system bootstrap event into bus
   */
  bus.emit("system.registry.boot", {
    id: cryptoRandomId(),
    type: "system.registry.boot",
    source: "registry",
    timestamp: Date.now(),
    payload: {
      agents: Object.keys(SYSTEM_REGISTRY.agents),
      engines: Object.keys(SYSTEM_REGISTRY.engines)
    }
  });

  return SYSTEM_REGISTRY;
}

/**
 * OPTIONAL: runtime introspection access
 */
export function getRegistry() {
  return SYSTEM_REGISTRY;
}

/**
 * INTERNAL UTIL
 */
function cryptoRandomId() {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).substring(2, 10)
  );
}
