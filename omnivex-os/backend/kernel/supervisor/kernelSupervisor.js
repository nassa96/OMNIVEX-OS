/**
 * OMNIVEX OS PRIME
 *
 * KERNEL SUPERVISOR
 *
 * Master lifecycle controller
 *
 * Responsibilities:
 * - boot kernel services
 * - start runtime heartbeat
 * - connect runtime bridge
 * - monitor system health
 * - expose deterministic state
 *
 */


const registry =
require("../registry");


const runtime =
require("../runtime/omnivexRuntime");


const RuntimeBridge =
require("../runtime/runtimeBridge");



class KernelSupervisor {


  constructor(){

    this.state={

      system:
      "OMNIVEX_OS_PRIME",

      status:
      "INITIALIZING",

      bootTime:
      null,

      heartbeat:
      0,

      services:
      {}

    };


    this.bridge =
    null;


  }



  boot(){

    console.log(
      "[KERNEL SUPERVISOR] BOOT"
    );


    this.state.bootTime =
    Date.now();



    this.startRuntime();


    this.startBridge();


    this.state.status =
    "ONLINE";


    console.log(
      "[KERNEL SUPERVISOR ONLINE]"
    );


  }



  startRuntime(){


    if(!runtime)
      throw new Error(
        "Runtime unavailable"
      );


    runtime.start(
      3000
    );


    this.state.services.runtime =
    "ONLINE";


  }



  startBridge(){


    this.bridge =
    new RuntimeBridge(
      runtime
    );


    this.bridge.start();


    this.state.services.bridge =
    "ONLINE";


  }



  health(){


    return {

      ...this.state,


      runtime:
      runtime.status(),

      registry:
      registry

    };


  }



  shutdown(){


    console.log(
      "[KERNEL SUPERVISOR STOPPING]"
    );


    runtime.stop();


    this.state.status =
    "OFFLINE";


  }


}



module.exports =
new KernelSupervisor();
