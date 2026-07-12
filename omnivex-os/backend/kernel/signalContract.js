/**
 * OMNIVEX OS PRIME
 *
 * SIGNAL CONTRACT
 */

const crypto = require("crypto");


function createSignal({

    type,

    strength = 0,

    asset = "UNKNOWN",

    source = "SOPHIA",

    metadata = {}

}){

    return {

        id:
            crypto.randomUUID(),

        ts:
            Date.now(),

        type,

        asset,

        strength,

        confidence:
            strength,

        source,

        metadata

    };

}


module.exports = {
    createSignal
};
