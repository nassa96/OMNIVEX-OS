/**
 * OMNIVEX OS PRIME
 *
 * KERNEL SUPERVISOR
 *
 * Lifecycle observer only.
 *
 * Runtime ownership:
 * server.js
 */

const registry = require("../registry");
const runtime = require("../runtime/omnivexRuntime");
const RuntimeBridge = require("../runtime/runtimeBridge");


class KernelSupervisor {


    constructor(){

        this.state = {

            system:
            "OMNIVEX_OS_PRIME",

            status:
            "INITIALIZING",

            bootTime:
            null,

            heartbeat:
            0,

            services:{}

        };


        this.bridge = null;

    }



    boot(){

        console.log(
            "[KERNEL SUPERVISOR] BOOT"
        );


        this.state.bootTime =
        Date.now();


        /*
          Runtime is NOT started here.
          server.js owns runtime lifecycle.
        */


        this.attachBridge();


        this.state.status =
        "ONLINE";


        console.log(
            "[KERNEL SUPERVISOR ONLINE]"
        );

    }



    attachBridge(){

        this.bridge =
        new RuntimeBridge(runtime);


        this.bridge.start();


        this.state.services.bridge =
        "ONLINE";

    }



    health(){

        return {

            ...this.state,

            runtime:
            runtime.status()

        };

    }

}



module.exports =
new KernelSupervisor();
