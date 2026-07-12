/**
 * OMNIVEX OS PRIME
 *
 * CANONICAL 16 AGENT RUNTIME CORE
 *
 * Runtime authority layer.
 *
 * Source of truth:
 * backend/kernel/registry/canonicalAgents.js
 *
 * Responsibilities:
 * - Maintain runtime heartbeat
 * - Expose canonical agent state
 * - Preserve governance chain
 * - Publish runtime events
 * - Feed ATLAS control plane
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


const GOVERNANCE_CHAIN = [
    "STREAMCORE",
    "MERCURY",
    "SOPHIA",
    "ELOHIM",
    "AEGIS",
    "SAINT",
    "CHRONICLE"
];


class OmnivexRuntime {


    constructor(){

        this.initialized = false;

        this.running = false;

        this.timer = null;

        this.heartbeatCount = 0;

    }



    init(){

        if(this.initialized){
            return;
        }


        this.initialized = true;


        pipelineRouter.init();


        console.log(
            "[OMNIVEX RUNTIME INITIALIZED]"
        );

    }




    getAgents(){

        return Object.fromEntries(

            Object.entries(agentRegistry)

            .map(([name,agent])=>[

                name,

                {

                    ...agent,

                    heartbeat:"ONLINE"

                }

            ])

        );

    }




    getGovernance(){

        return {

            intelligence:
                "SOPHIA",

            authority:
                "ELOHIM",

            risk:
                "AEGIS",

            execution:
                "SAINT",

            memory:
                "CHRONICLE"

        };

    }




    heartbeat(){


        this.heartbeatCount++;



        const runtimeState = {


            runtime:
                "OMNIVEX_OS_PRIME",


            version:
                "PRIME-16_AGENT_RUNTIME",


            heartbeat:
                this.heartbeatCount,


            pipeline:
                GOVERNANCE_CHAIN,


            governance:
                this.getGovernance(),


            agents:
                this.getAgents(),


            timestamp:
                Date.now()

        };



        stateStore.update(

            "agents",

            runtimeState.agents

        );


        stateStore.update(

            "runtime",

            runtimeState

        );




        chronicle.record({

            type:
                "runtime.heartbeat",


            source:
                "OMNIVEX_RUNTIME",


            ...runtimeState

        });




        pipelineRouter.publish(

            "runtime.heartbeat",

            {

                source:
                    "OMNIVEX_RUNTIME",


                data:
                    runtimeState

            }

        );




        console.log(

            "[OMNIVEX HEARTBEAT]",

            this.heartbeatCount,

            "|",

            Object.keys(
                runtimeState.agents
            ).length,

            "AGENTS ONLINE"

        );



        return runtimeState;

    }




    start(interval=3000){


        if(this.running){

            return;

        }



        this.init();



        this.running = true;



        this.timer = setInterval(

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


            runtime:
                "OMNIVEX_OS_PRIME",


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

