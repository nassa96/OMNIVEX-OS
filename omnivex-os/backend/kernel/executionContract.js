/**
 * OMNIVEX OS PRIME
 *
 * EXECUTION CONTRACT
 */

const crypto = require("crypto");


function createExecutionOrder({

    asset,

    side = "BUY",

    size = 0,

    confidence = 0,

    source = "SAINT"

}){


    return {

        id:
            crypto.randomUUID(),

        ts:
            Date.now(),

        type:
            "EXECUTION_ORDER",

        asset,

        side,

        size,

        confidence,

        source,

        status:
            "PENDING"

    };


}


module.exports = {
    createExecutionOrder
};
