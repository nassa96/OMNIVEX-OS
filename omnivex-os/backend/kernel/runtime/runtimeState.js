/**
 * OMNIVEX OS PRIME
 *
 * CENTRAL RUNTIME STATE STORE
 *
 * Single source of truth.
 */

class RuntimeState {


  constructor(){

    this.state = {

      system:
        "OMNIVEX_OS_PRIME",

      heartbeat:
        0,

      status:
        "BOOTING",

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

      timestamp:
        null

    };

  }



  update(data={}){

    this.state = {

      ...this.state,

      ...data,

      timestamp:
        Date.now()

    };


    return this.state;

  }



  heartbeat(){

    this.state.heartbeat++;

    this.state.timestamp =
      Date.now();

    return this.state;

  }



  get(){

    return this.state;

  }



  reset(){

    this.state = {

      system:
        "OMNIVEX_OS_PRIME",

      heartbeat:
        0,

      status:
        "RESET",

      market:null,

      signal:null,

      decision:null,

      risk:null,

      execution:null,

      timestamp:
        Date.now()

    };


    return this.state;

  }


}


module.exports =
  new RuntimeState();
