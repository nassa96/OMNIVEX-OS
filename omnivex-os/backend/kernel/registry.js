/**
 * OMNIVEX OS PRIME
 * KERNEL REGISTRY
 *
 * SINGLE SOURCE OF TRUTH
 * CommonJS Runtime Compatible
 */


const SYSTEM_REGISTRY = {

  agents:{},

  engines:{},

  services:{},

  metadata:{},

  bus:null

};



function registerCore(bus, payload={}){


  SYSTEM_REGISTRY.bus = bus;


  SYSTEM_REGISTRY.metadata = {

    timestamp: Date.now(),

    env: payload.env || {}

  };



  SYSTEM_REGISTRY.agents =
    payload.agents || {};



  SYSTEM_REGISTRY.engines =
    payload.engines || {};



  SYSTEM_REGISTRY.services = {

    ledger:
      payload.ledger || null,


    chronicle:
      payload.chronicle || null

  };



  if(bus){

    bus.emit(
      "system.registry.boot",
      {

        id:createId(),

        type:"system.registry.boot",

        source:"registry",

        timestamp:Date.now(),


        payload:{

          agents:
          Object.keys(
            SYSTEM_REGISTRY.agents
          ),


          engines:
          Object.keys(
            SYSTEM_REGISTRY.engines
          )

        }

      }

    );

  }


  return SYSTEM_REGISTRY;

}




function getRegistry(){

  return SYSTEM_REGISTRY;

}




function registerAgent(name,data={}){


  SYSTEM_REGISTRY.agents[name]={

    status:"ONLINE",

    registered:
      Date.now(),

    ...data

  };


  console.log(
    "[REGISTRY] REGISTERED:",
    name
  );


}




function registerEngine(name,data={}){


  SYSTEM_REGISTRY.engines[name]={

    status:"ONLINE",

    registered:
      Date.now(),

    ...data

  };


  console.log(
    "[REGISTRY] ENGINE:",
    name
  );

}




function createId(){

  return (

    Date.now()
      .toString(36)

    +

    Math.random()
      .toString(36)
      .slice(2,10)

  );

}



module.exports={

  registerCore,

  getRegistry,

  registerAgent,

  registerEngine

};
