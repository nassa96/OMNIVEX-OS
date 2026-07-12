/**
 * OMNIVEX OS PRIME
 *
 * CANONICAL EVENT CONTRACT
 *
 * All subsystem communication
 * MUST pass through this structure.
 */

const crypto = require("crypto");


function createEvent({

    type,

    source = "unknown",

    data = {},

    severity = "info",

    route = [],

    correlationId = null,

    authority = null

}) {


    return {

        id:
            crypto.randomUUID(),


        ts:
            Date.now(),


        type,


        source,


        data,


        authority,


        meta:{

            severity,

            route,

            correlationId:
                correlationId ||
                crypto.randomUUID()

        }

    };

}



function normalizeEvent(event = {}){


    return createEvent({

        type:
            event.type ||
            "unknown",


        source:
            event.source ||
            "unknown",


        data:
            event.data ||
            event,


        severity:
            event.meta?.severity ||
            "info",


        route:
            event.meta?.route ||
            [],


        correlationId:
            event.meta?.correlationId,


        authority:
            event.authority ||
            null

    });


}



function isValidEvent(event){


    return Boolean(

        event &&

        typeof event.id === "string" &&

        typeof event.ts === "number" &&

        typeof event.type === "string" &&

        typeof event.source === "string"

    );


}



module.exports = {

    createEvent,

    normalizeEvent,

    isValidEvent

};
