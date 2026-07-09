/**
 * OMNIVEX OS PRIME
 *
 * ELOHIM RUNTIME BRIDGE
 *
 * Connects:
 *
 * SOPHIA SIGNAL
 *        |
 *        v
 * ELOHIM DECISION
 *
 */

const eventBus =
require("../eventBus");



class ElohimRuntimeBridge {


    constructor(){


        this.state = {

            decisions:0,

            lastDecision:null,

            mode:"GOVERNANCE"

        };


        this.init();


    }





    init(){


        if(
            eventBus &&
            typeof eventBus.subscribe === "function"
        ){


            eventBus.subscribe(

                "sophia.signal",

                (signal)=>{


                    const decision =
                    this.resolve({

                        signal

                    });



                    eventBus.publish(

                        "elohim.decision",

                        decision

                    );


                }

            );


            console.log(
                "[ELOHIM BRIDGE ONLINE]"
            );


        }


    }







    resolve(context){


        if(!context){


            return {

                type:
                "elohim.decision",

                action:
                "HOLD",

                confidence:
                0,

                reason:
                "NO_CONTEXT"

            };


        }




        const signal =
        context.signal || {};



        const confidence =
        Number(
            signal.confidence || 0
        );



        let action =
        "HOLD";



        if(
            signal.action === "BUY" &&
            confidence >= 0.65
        ){

            action =
            "BUY";

        }



        else if(
            signal.action === "SELL" &&
            confidence >= 0.65
        ){

            action =
            "SELL";

        }





        const decision = {


            type:
            "elohim.decision",


            action,


            confidence,


            symbol:
            signal.symbol || "BTC",


            source:
            "ELOHIM_RUNTIME_BRIDGE",


            timestamp:
            Date.now()


        };



        this.state.decisions++;


        this.state.lastDecision =
        decision;



        console.log(

            "[ELOHIM DECISION]",

            action,

            confidence

        );



        return decision;


    }







    status(){


        return this.state;


    }


}





module.exports =
new ElohimRuntimeBridge();
