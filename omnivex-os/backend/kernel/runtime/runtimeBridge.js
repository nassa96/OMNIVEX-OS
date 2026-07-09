/**
 * OMNIVEX OS PRIME
 *
 * RUNTIME EVENT BRIDGE
 *
 * Runtime heartbeat -> EventBus -> Agents
 *
 */


const eventBus =
require("../eventBus");



class RuntimeBridge {


  constructor(runtime){

    this.runtime = runtime;

    this.active=false;

  }



  start(){


    if(this.active)
      return;


    this.active=true;


    console.log(
      "[RUNTIME BRIDGE ONLINE]"
    );



    eventBus.on(
      "runtime.heartbeat",
      (state)=>{


        eventBus.emit(
          "system.tick",
          {

            heartbeat:
            state.heartbeat,

            timestamp:
            Date.now()

          }

        );


      }
    );


  }



  stop(){

    this.active=false;

  }


}



module.exports = RuntimeBridge;
