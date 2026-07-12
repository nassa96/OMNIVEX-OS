/**
 * OMNIVEX OS PRIME
 *
 * ELOHIM GOVERNANCE BRIDGE
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


        eventBus.subscribe(

            "sophia.signal",

            (event)=>{


                const signal =
                event.data || event;



                const decision =
                this.resolve(signal);



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





    resolve(signal){


        signal =
        signal || {};



        let action =
        "WAIT";



        const confidence =
        Number(
            signal.confidence || 0
        );



        if(
            signal.action === "BUY" &&
            confidence >= 0.65
        ){

            action="BUY";

        }



        if(
            signal.action === "SELL" &&
            confidence >= 0.65
        ){

            action="SELL";

        }



        const decision = {


            type:
            "elohim.decision",


            action,


            confidence,


            symbol:
            signal.symbol ||
            "BTC",


            source:
            "ELOHIM",


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
