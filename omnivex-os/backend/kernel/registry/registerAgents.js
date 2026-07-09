/**
 * OMNIVEX OS PRIME
 *
 * AGENT REGISTRY BOOTSTRAP
 *
 * Deterministic module registry
 *
 * Responsibilities:
 * - register all active agents
 * - expose health state
 * - prevent duplicate loading
 * - provide runtime lookup
 */


const registry = new Map();



function register(name, module){

    if(registry.has(name)){
        return registry.get(name);
    }


    const agent = {

        name,

        status:
        module ? "ONLINE" : "OFFLINE",

        registered:
        Date.now(),

        module:
        module || null

    };


    registry.set(
        name,
        agent
    );


    console.log(
        "[REGISTRY] REGISTERED:",
        name
    );


    return agent;

}





function safeRequire(path){

    try{

        return require(path);

    }

    catch(err){

        console.log(
            "[REGISTRY OPTIONAL OFFLINE]",
            path
        );

        return null;

    }

}





function boot(){


    if(registry.size){
        return registry;
    }




    /*
    ============================
    INTELLIGENCE
    ============================
    */


    register(
        "SOPHIA",
        safeRequire(
            "../../agents/sophia/sophiaEngine"
        )
        ||
        safeRequire(
            "../sophia/sophiaEvolutionEngine"
        )
    );





    /*
    ============================
    MARKET DATA
    ============================
    */


    let mercury = null;


    try{

        const Mercury =
        require("../../core/mercury");


        mercury =
        new Mercury();


    }

    catch(err){}



    register(
        "MERCURY",
        mercury
    );





    /*
    ============================
    RISK GOVERNOR
    ============================
    */


    register(
        "AEGIS",
        safeRequire(
            "../aegis/aegisCore"
        )
    );





    /*
    ============================
    ORCHESTRATION
    ============================
    */


    register(
        "ELOHIM",
        safeRequire(
            "../elohimOrchestrator"
        )
    );





    /*
    ============================
    EXECUTION
    ============================
    */


    register(
        "SAINT",
        safeRequire(
            "../../agents/saint/saintEngine"
        )
    );





    /*
    ============================
    MEMORY
    ============================
    */


    register(
        "CHRONICLE",
        safeRequire(
            "../../chronicle/core/chronicleEngine"
        )
        ||
        safeRequire(
            "../memory/chronicleStore"
        )
    );





    return registry;

}





function get(name){

    boot();


    return registry.get(name)
    ||
    null;

}





function all(){

    boot();


    return Array.from(
        registry.values()
    );

}





function health(){

    boot();


    return {

        total:
        registry.size,


        agents:
        all().map(agent=>({

            name:
            agent.name,


            status:
            agent.status,


            registered:
            agent.registered

        })),


        timestamp:
        Date.now()

    };

}





module.exports = function registerAgents(){

    boot();


    return {

        health,

        all,

        get

    };

};
