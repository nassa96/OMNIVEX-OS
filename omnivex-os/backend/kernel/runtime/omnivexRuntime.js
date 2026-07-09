const stateStore = require("../state/stateStore");
const chronicle = require("../memory/chronicleStore");
const agentRegistry = require("../agents/agentRegistry");

const eventBus =
require("../eventBus");

const sophia =
require("../sophia/sophiaEvolutionEngine");

const EvolutionController =
require("../../core/forge/evolution/evolutionController");

const createMercuryStreamCore =
require("../mercuryStreamCore");

const mercuryAdapter =
require("../mercuryAdapter");



class OmnivexRuntime {


    constructor(){


        this.running = false;

        this.timer = null;



        this.forge =
        new EvolutionController();



        this.mercury =
        createMercuryStreamCore({

            bus:
            mercuryAdapter,

            chronicle:
            mercuryAdapter.chronicle

        });



        eventBus.subscribe(
            "sophia.signal",
            (signal)=>{


                stateStore.update(
                    "signal",
                    signal
                );


                console.log(
                    "[SOPHIA SIGNAL]",
                    signal.action,
                    signal.confidence
                );


            }
        );


        sophia.init();



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


        catch(err){


            console.error(
                "[MERCURY STATE ERROR]",
                err.message
            );


            return {};

        }


    }







    updateForge(){


        try{


            const evolution =
            this.forge.evolve();



            stateStore.update(

                "forge",

                {

                    status:
                    evolution.status ||
                    "ACTIVE",


                    generation:
                    evolution.generation ||
                    0,


                    population:
                    evolution.population ||
                    0,


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

                    error:
                    err.message

                }

            );


        }


    }







    heartbeat(){


        try{


            const agents =
            this.getAgents();



            const assets =
            this.getMarket();



            const symbols =
            Object.keys(
                assets
            );



            const primary =
            symbols[0] ||
            "BTC";



            const primaryAsset =
            assets[primary] ||
            {};



            const market = {


                assets,


                symbol:
                primary,


                price:
                primaryAsset.price ||
                0,


                volume:
                primaryAsset.volume ||
                0,


                trend:
                "LIVE_MARKET",


                timestamp:
                Date.now()


            };



            stateStore.update(
                "market",
                market
            );



            const existingSignal =
            stateStore.get().signal ||
            {

                type:
                "sophia.signal",

                action:
                "HOLD",

                confidence:
                0,

                symbol:
                market.symbol

            };



            const decision = {


                type:
                "elohim.decision",


                action:
                existingSignal.action === "BUY" ||
                existingSignal.action === "SELL"
                ?
                existingSignal.action
                :
                "WAIT",


                confidence:
                existingSignal.confidence,


                source:
                "OMNIVEX_RUNTIME"


            };



            const risk = {


                action:
                "REDUCE",


                confidence:
                existingSignal.confidence


            };



            const execution = {


                type:
                "saint.execution",


                action:
                decision.action === "WAIT"
                ?
                "HOLD"
                :
                decision.action,


                confidence:
                decision.confidence,


                symbol:
                market.symbol,


                price:
                market.price,


                ts:
                market.timestamp


            };



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


                signal:
                existingSignal,


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



        this.timer =
        setInterval(

            ()=>this.heartbeat(),

            interval

        );


    }







    stop(){


        this.running=false;



        if(this.timer){

            clearInterval(
                this.timer
            );

        }



        console.log(
            "[OMNIVEX RUNTIME STOPPED]"
        );


    }







    status(){


        return stateStore.get();


    }



}



module.exports =

module.exports = new OmnivexRuntime();
