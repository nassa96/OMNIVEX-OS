/**
 * OMNIVEX OS PRIME
 *
 * Unified Autonomous Runtime Core
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

        this.initialized = false;

        this.running = false;

        this.timer = null;

        this.heartbeatCount = 0;

        this.mercury = null;

    }


    init(){

        if(this.initialized){

            return;

        }


        this.initialized = true;


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

        if(
            this.mercury &&
            typeof this.mercury.getState === "function"
        ){

            return this.mercury.getState();

        }


        return {};

    }



    heartbeat(){

        this.heartbeatCount++;


        const market =
            this.getMarket();


        const runtimeEvent = {

            heartbeat:
                this.heartbeatCount,

            market,

            agents:
                this.getAgents(),

            timestamp:
                Date.now()

        };


        stateStore.update(
            "market",
            market
        );


        chronicle.record({

            type:
                "runtime.heartbeat",

            source:
                "OMNIVEX_RUNTIME",

            ...runtimeEvent

        });


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


        this.timer = null;

        this.running = false;


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
                this.running,

            initialized:
                this.initialized

        };

    }

}


module.exports =
    new OmnivexRuntime();

