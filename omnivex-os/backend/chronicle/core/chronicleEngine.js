/**
 * OMNIVEX OS
 * CHRONICLE MEMORY BRIDGE
 *
 * Temporary compatibility layer.
 * All persistent memory flows through kernel/memory/chronicleStore.
 */

const chronicleStore = require("../../kernel/memory/chronicleStore");

function record(event){

    return chronicleStore.record({
        type:"chronicle.event",
        ...event
    });

}


function getHistory(){

    return chronicleStore.replay();

}


module.exports = {

    record,
    getHistory

};
