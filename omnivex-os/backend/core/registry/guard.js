import { resolve } from "./canonical.js";

/**
 * SAFE IMPORT LAYER
 * Ensures system always uses canonical modules
 */

export async function load(module, key) {
  const path = resolve(module, key);

  if (!path) {
    throw new Error(`CANONICAL MODULE NOT FOUND: ${module}.${key}`);
  }

  return import(path);
}
