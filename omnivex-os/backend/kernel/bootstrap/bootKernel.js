/**
 * OMNIVEX OS PRIME
 *
 * BOOTSTRAP KERNEL
 *
 * Deterministic startup controller
 *
 * Responsibilities:
 * - initialize infrastructure
 * - load market feeds
 * - connect execution pipeline
 * - prevent duplicate intelligence loops
 */

const eventBus = require("../eventBus");

const aurin =
require("../aurin/aurinCore");

const { init: initMercury } =
require("../mercuryFeed");

const saint =
require("../../agents/saint/saintEngine");

const chronicle =
require("../../chronicle/core/chronicleEngine");


let BOOTED = false;


class BootKernel {


    constructor(){

        this.state = {

            phase:"IDLE",

            healthy:false,

            startedAt:null

        };

    }





    async start(){


        if(BOOTED){

            console.log(
                "[BOOT] ALREADY ACTIVE"
            );

            return;

        }



        BOOTED = true;


        this.state.phase =
        "BOOTING";


        this.state.startedAt =
        Date.now();



        console.log(
            "🚀 OMNIVEX BOOT SEQUENCE INITIATED"
        );



        await this.initializeEventBus();


        await this.loadCoreLayers();


        await this.connectAgents();


        await this.finalizeBoot();



        this.state.phase =
        "RUNNING";


        this.state.healthy =
        true;



        console.log(
            "✅ OMNIVEX SYSTEM ONLINE"
        );


    }







    async initializeEventBus(){


        if(
            !eventBus.publish ||
            !eventBus.subscribe
        ){

            throw new Error(
                "EVENT BUS INVALID"
            );

        }


        eventBus.publish(
            "system.boot.phase",
            {

                phase:
                "event_bus_ready",

                ts:
                Date.now()

            }

        );


    }







    async loadCoreLayers(){


        console.log(
            "📡 LOADING MARKET CORE"
        );



        initMercury();



        eventBus.publish(
            "system.boot.phase",
            {

                phase:
                "core_loaded",

                ts:
                Date.now()

            }

        );


    }








    async connectAgents(){


        console.log(
            "🤖 CONNECTING EXECUTION"
        );



        /*
        SOPHIA IS OWNED BY
        omnivexRuntime.js

        DO NOT CREATE ANOTHER
        SIGNAL LOOP HERE
        */



        eventBus.subscribe(
            "sophia.signal",
            (signal)=>{


                const execution =
                saint.executeSignal(
                    signal
                );


                eventBus.publish(
                    "saint.execution",
                    execution
                );


            }
        );





        eventBus.subscribe(
            "saint.execution",
            (exec)=>{


                chronicle.record({

                    type:
                    "saint.execution",

                    ...exec,

                    ts:
                    Date.now()

                });


            }
        );



        eventBus.publish(
            "system.boot.phase",
            {

                phase:
                "agents_connected",

                ts:
                Date.now()

            }

        );


    }








    async finalizeBoot(){


        aurin.init();



        eventBus.publish(
            "system.boot.complete",
            {

                status:
                "ONLINE",

                ts:
                Date.now()

            }

        );


    }






    getStatus(){

        return this.state;

    }



}


module.exports =
new BootKernel();

