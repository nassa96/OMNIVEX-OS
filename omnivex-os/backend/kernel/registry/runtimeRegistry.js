/**
 * OMNIVEX OS PRIME
 *
 * RUNTIME REGISTRY
 *
 * SINGLE SOURCE OF AGENT DISCOVERY
 */


class RuntimeRegistry {


  constructor(){

    this.agents = {};

    this.timestamp = Date.now();

  }



  register(name, instance){

    if(!name)
      throw new Error(
        "Registry requires agent name"
      );


    this.agents[name] = {

      name,

      instance,

      status:
        "ONLINE",

      registered:
        Date.now()

    };


    console.log(
      "[REGISTRY] REGISTERED:",
      name
    );


    return this.agents[name];

  }




  get(name){

    return this.agents[name];

  }




  list(){

    return Object.values(
      this.agents
    ).map(agent => ({

      name:
        agent.name,

      status:
        agent.status,

      registered:
        agent.registered

    }));

  }




  health(){

    return {

      total:
        Object.keys(this.agents).length,

      agents:
        this.list(),

      timestamp:
        Date.now()

    };

  }


}


module.exports =
new RuntimeRegistry();
