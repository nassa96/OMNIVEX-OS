/**
 * OMNIVEX OS PRIME
 *
 * Unified Autonomous Runtime Core
 *
 * Governed flow:
 *
 * MERCURY
 *    ↓
 * SOPHIA
 *    ↓
 * ELOHIM
 *    ↓
 * AURIN
 *    ↓
 * AEGIS
 *    ↓
 * SAINT
 *    ↓
 * CHRONICLE
 */

const stateStore =
    require("../state/stateStore");


const chronicle =
    require("../memory/chronicleStore");


const agentRegistry =
    require("../agents/agentRegistry");


const eventBus =
    require("../eventBus");


const pipelineRouter =
    require("./pipelineRouter");


const sophia =
    require("../sophia/sophiaEvolutionEngine");


const aurin =
    require("../aurin/aurinCore");


const aegis =
    require("../aegis/aegisCore");


const createMercuryStreamCore =
    require("../mercuryStreamCore");


const mercuryAdapter =
    require("../mercuryAdapter");


require("../saint/saintExecutionEngine");



class OmnivexRuntime {


    constructor(){


        this.running = false;

        this.timer = null;

        this.heartbeatCount = 0;



        this.mercury =
            createMercuryStreamCore({

                bus:
                    mercuryAdapter,

                chronicle:
                    mercuryAdapter.chronicle

            });



        pipelineRouter.init();



        this.bindEvents();



        sophia.init();

        aurin.init();

        aegis.init();



        console.log(
            "[OMNIVEX RUNTIME READY]"
        );


    }



    bindEvents(){


        eventBus.subscribe(

            "sophia.signal",

            (event)=>{


                eventBus.publish(

                    "aegis.evaluate",

                    {

                        source:
                            "SOPHIA",

                        signal:
                            event.data

                    }

                );


            }

        );



        eventBus.subscribe(

            "aegis.approved",

            (event)=>{


                eventBus.publish(

                    "aurin.evaluate",

                    {

                        source:
                            "AEGIS",

                        ...event.data

                    }

                );


            }

        );



        eventBus.subscribe(

            "aurin.execution.approved",

            (event)=>{


                eventBus.publish(

                    "saint.execution",

                    {

                        source:
                            "AURIN",

                        ...event.data

                    }

                );


            }

        );


    }



    getAgents(){


        return Object.fromEntries(

            Object.entries(agentRegistry)
            .map(

                ([name,agent])=>[

                    name,

                    {

                        ...agent,

                        heartbeat:
                            "ONLINE"

                    }

                ]

            )

        );

    }



    getMarket(){


        try{


            if(
                this.mercury &&
                typeof this.mercury.getState === "function"
            ){

                return this.mercury.getState();

            }


            return {};


        }
        catch(error){


            console.error(
                "[MERCURY ERROR]",
                error.message
            );


            return {};

        }

    }




    heartbeat(){


        try{


            this.heartbeatCount++;



            const agents =
                this.getAgents();



            const market =
                this.getMarket();



            stateStore.update(
                "market",
                market
            );



            const runtimeEvent = {


                heartbeat:
                    this.heartbeatCount,


                market,


                agents,


                timestamp:
                    Date.now()


            };



            chronicle.record(
                runtimeEvent
            );



            pipelineRouter.publish(

                "runtime.heartbeat",

                {

                    source:
                        "OMNIVEX_RUNTIME",

                    data:
                        runtimeEvent

                }

            );



            console.log(

                "[OMNIVEX HEARTBEAT]",

                this.heartbeatCount

            );



            return runtimeEvent;


        }
        catch(error){


            console.error(

                "[RUNTIME ERROR]",

                error.message

            );


        }


    }



    start(interval=3000){


        if(this.running){

            return;

        }


        this.running = true;



        this.timer =

            setInterval(

                ()=>this.heartbeat(),

                interval

            );



        console.log(
            "[OMNIVEX RUNTIME ONLINE]"
        );


    }




    stop(){


        if(this.timer){

            clearInterval(
                this.timer
            );

        }


        this.running=false;


        console.log(
            "[OMNIVEX RUNTIME STOPPED]"
        );


    }




    status(){


        return {


            ...stateStore.get(),


            heartbeat:
                this.heartbeatCount,


            running:
                this.running


        };


    }


}



module.exports =
    new OmnivexRuntime();
