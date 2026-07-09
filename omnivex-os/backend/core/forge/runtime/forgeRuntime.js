/**
 * OMNIVEX FORGE RUNTIME BRIDGE
 * Evolution state interface
 */

const evolution =
require("../evolution/evolutionController");


const state = {

    status: "BOOTING",

    generation: 0,

    population: 0,

    lastEvolution: null,

    timestamp: null

};



function evolve(){

    const result =
        evolution.evolve();


    state.status =
        result.status;


    state.generation =
        result.generation;


    state.population =
        result.population;


    state.lastEvolution =
        result;


    state.timestamp =
        Date.now();


    return state;

}



function getState(){

    return state;

}



module.exports = {

    evolve,

    getState

};
