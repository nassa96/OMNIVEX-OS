/**
 * OMNIVEX STATE STORE
 * Global deterministic runtime state
 */

const state = {

    system:
        "OMNIVEX_OS_PRIME",

    status:
        "BOOTING",

    heartbeat:
        0,


    market:
        null,

    signal:
        null,

    decision:
        null,

    risk:
        null,

    execution:
        null,


    forge:
        {
            status:
                "BOOTING",

            generation:
                0,

            population:
                0,

            lastEvolution:
                null
        },


    agents:
        {},


    timestamp:
        null

};



function update(key,value){

    state[key] = value;

    state.timestamp =
        Date.now();

}



function incrementHeartbeat(){

    state.heartbeat++;

    state.timestamp =
        Date.now();

}



function updateForge(data){

    state.forge = data;

    state.timestamp =
        Date.now();

}



function online(){

    state.status =
        "ONLINE";

    state.timestamp =
        Date.now();

}



function get(){

    return state;

}



module.exports = {

    update,

    updateForge,

    incrementHeartbeat,

    online,

    get

};
