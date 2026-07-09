/**
 * OMNIVEX FORGE — REPLAY ENGINE
 * CHRONICLE CONNECTED
 * CommonJS Runtime Compatible
 */


const chronicle =
require("../../kernel/memory/chronicleStore");



function loadReplay(){

    const events =
    chronicle.all();



    if(!Array.isArray(events)){

        return [];

    }



    return events.filter(

        event =>
        event.type === "strategy.replay"

    );


}



function recordReplay(event = {}){


    return chronicle.record({

        type:"strategy.replay",

        ...event

    });


}



function clearReplay(){

    return;

}



module.exports = {

    loadReplay,

    recordReplay,

    clearReplay

};
