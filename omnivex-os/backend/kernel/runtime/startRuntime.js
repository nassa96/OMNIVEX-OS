/**
 * OMNIVEX OS PRIME
 *
 * Runtime access bridge.
 *
 * IMPORTANT:
 * Runtime lifecycle is controlled by server.js.
 * This file no longer starts the runtime automatically.
 */

const runtime = require("./omnivexRuntime");

module.exports = runtime;
