const stateStore = require("../state/stateStore");
const chronicle = require("../memory/chronicleStore");
const agentRegistry = require("../agents/agentRegistry");

const EvolutionController =
require("../../core/forge/evolution/evolutionController");


class OmnivexRuntime {


    constructor(){

        this.running = false;

        this.timer = null;

        this.forge =
        new EvolutionController();

    }



    getAgents(){

        return Object.fromEntries(

            Object.entries(agentRegistry)
            .map(([name, agent])=>[

                name,

                {
                    ...agent,
                    heartbeat:"ONLINE"
                }

            ])

        );

    }




    updateForge(){

        try{

            const evolution =
            this.forge.evolve();


            stateStore.update(
                "forge",
                {

                    status:
                    evolution.status || "ACTIVE",

                    generation:
                    evolution.generation || 0,

                    population:
                    evolution.population || 0,

                    lastEvolution:
                    Date.now()

                }
            );


        }
        catch(err){

            stateStore.update(
                "forge",
                {

                    status:"ERROR",

                    error:err.message

                }
            );

        }

    }




    heartbeat(){

        try{


            const agents =
            this.getAgents();



            const market = {

                symbol:"SOL",

                price:Number(
                    (80 + Math.random())
                    .toFixed(2)
                ),

                volume:5000000,

                trend:"BEARISH",

                timestamp:Date.now()

            };



            const signal={

                type:"sophia.signal",

                action:"HOLD",

                confidence:Number(
                    Math.random()
                    .toFixed(3)
                ),

                symbol:market.symbol,

                trend:market.trend,

                ts:market.timestamp

            };



            const decision={

                type:"elohim.decision",

                action:"WAIT",

                confidence:
                signal.confidence,

                source:
                "OMNIVEX_RUNTIME"

            };



            const risk={

                action:"REDUCE",

                confidence:
                signal.confidence

            };



            const execution={

                type:"saint.execution",

                action:"HOLD",

                confidence:
                signal.confidence,

                symbol:
                market.symbol,

                price:
                market.price,

                ts:
                market.timestamp

            };



            stateStore.update(
                "market",
                market
            );


            stateStore.update(
                "signal",
                signal
            );


            stateStore.update(
                "decision",
                decision
            );


            stateStore.update(
                "risk",
                risk
            );


            stateStore.update(
                "execution",
                execution
            );


            stateStore.update(
                "agents",
                agents
            );


            this.updateForge();



            stateStore.online();



            chronicle.record({

                type:
                "omnivex.heartbeat",

                market,

                signal,

                decision,

                risk,

                execution,

                agents,

                forge:
                stateStore.get().forge

            });



            console.log(

                "[OMNIVEX HEARTBEAT]",

                "HB:",
                stateStore.get().heartbeat,

                "|",

                decision.action,

                "|",

                execution.action,

                "|",

                stateStore.get().forge.status,

                "|",

                Object.keys(agents).length,

                "AGENTS ONLINE"

            );


        }
        catch(err){

            console.error(
                "[RUNTIME ERROR]",
                err.message
            );

        }

    }




    start(interval=3000){

        if(this.running)
            return;


        this.running=true;


        console.log(
            "[OMNIVEX RUNTIME ONLINE]"
        );


        this.timer=setInterval(

            ()=>this.heartbeat(),

            interval

        );


    }




    stop(){

        this.running=false;


        if(this.timer)

            clearInterval(
                this.timer
            );


        console.log(
            "[OMNIVEX RUNTIME STOPPED]"
        );

    }




    status(){

        return stateStore.get();

    }


}


module.exports =
new OmnivexRuntime();
