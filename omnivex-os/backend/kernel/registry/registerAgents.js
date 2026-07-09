/**
 * OMNIVEX OS PRIME
 *
 * AGENT REGISTRY BOOTSTRAP
 *
 * Single source of truth for active system modules
 */


const registry = [];


function register(name, module){

  const agent = {

    name,

    status:
    "ONLINE",

    registered:
    Date.now(),

    module:
    module || null

  };


  registry.push(agent);


  console.log(
    "[REGISTRY] REGISTERED:",
    name
  );


  return agent;

}




function boot(){

  if(registry.length)
    return registry;



  // ============================
  // INTELLIGENCE LAYER
  // ============================


  let sophia = null;

  try{

    sophia =
    require("../../agents/sophia/sophiaEngine");

  }catch(e){}



  register(
    "SOPHIA",
    sophia
  );



  // ============================
  // MARKET DATA LAYER
  // ============================


  let mercury = null;

  try{

    const Mercury =
    require("../../core/mercury");

    mercury =
    new Mercury();

  }catch(e){}



  register(
    "MERCURY",
    mercury
  );



  // ============================
  // RISK GOVERNOR
  // ============================


  let aegis = null;

  try{

    aegis =
    require("../aegis/aegisCore");

  }catch(e){}



  register(
    "AEGIS",
    aegis
  );



  // ============================
  // ORCHESTRATOR
  // ============================


  let elohim = null;

  try{

    elohim =
    require("../elohimOrchestrator");

  }catch(e){}



  register(
    "ELOHIM",
    elohim
  );



  // ============================
  // EXECUTION ENGINE
  // ============================


  let saint = null;

  try{

    saint =
    require("../../agents/saint/saintEngine");

  }catch(e){}



  register(
    "SAINT",
    saint
  );



  // ============================
  // MEMORY SYSTEM
  // ============================


  let chronicle = null;

  try{

    chronicle =
    require("../../chronicle/core/chronicleEngine");

  }catch(e){}



  register(
    "CHRONICLE",
    chronicle
  );



  return registry;

}




function health(){

  return {

    total:
    registry.length,


    agents:
    registry.map(agent=>({

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




module.exports =
function registerAgents(){

  boot();


  return {

    health,

    all:()=>registry

  };

};
