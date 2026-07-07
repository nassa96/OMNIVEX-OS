/**
 * ENGINE REGISTRY V1
 * Defines required engine contract for system boot validation
 */

export const REQUIRED_ENGINES = [
  "sophia",
  "risk",
  "strategy",
  "consensus",
  "trace"
];

/**
 * Validates all engines expose `.run()`
 */
export function validateEngines(modules) {
  const missing = [];
  const invalid = [];

  for (const name of REQUIRED_ENGINES) {
    const engine = modules[name];

    if (!engine) {
      missing.push(name);
      continue;
    }

    if (typeof engine.run !== "function") {
      invalid.push(name);
    }
  }

  return {
    ok: missing.length === 0 && invalid.length === 0,
    missing,
    invalid
  };
}
