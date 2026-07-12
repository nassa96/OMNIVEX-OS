/**
 * OMNIVEX OS PRIME
 *
 * RUNTIME AGENT REGISTRY
 *
 * This file does not define agents.
 * It exposes the canonical architecture registry
 * as runtime state.
 *
 * Source of truth:
 * backend/kernel/registry/canonicalAgents.js
 */

const canonicalAgents =
    require("../registry/canonicalAgents");


const agents = {};


for(const [name, definition] of Object.entries(canonicalAgents)){

    agents[name] = {

        status:"ONLINE",

        role:
            definition.role,

        layer:
            definition.layer,

        owner:
            definition.owner,

        heartbeat:
            "ONLINE",

        registered:
            Date.now()

    };

}


module.exports = agents;
