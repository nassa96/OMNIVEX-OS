/**
 * OMNIVEX OS PRIME
 *
 * ELOHIM ORCHESTRATOR
 *
 * Decision authority layer
 *
 * Flow:
 *
 * SOPHIA SIGNAL
 *      |
 *      v
 * ELOHIM DECISION
 *      |
 *      v
 * AEGIS / SAINT
 *
 */

function createElohimOrchestrator({

    bus,
    chronicle,
    ledger

} = {}){


    let lastDecision = null;


    const state = {

        mode:"LIVE",

        decisions:0,

        timestamp:null

    };



    function evaluate(signal){


        if(!signal){

            return {

                type:"elohim.decision",

                action:"WAIT",

                confidence:0,

                source:"ELOHIM_RUNTIME"

            };

        }



        const confidence =
        Number(
            signal.confidence || 0
        );



        let action="WAIT";



        if(
            signal.action==="BUY" &&
            confidence >=0.65
        ){

            action="BUY";

        }



        else if(
            signal.action==="SELL" &&
            confidence >=0.65
        ){

            action="SELL";

        }



        else {

            action="HOLD";

        }




        const decision = {


            type:
            "elohim.decision",


            action,


            confidence,


            symbol:
            signal.symbol || "BTC",


            source:
            "ELOHIM_RUNTIME",


            timestamp:
            Date.now()

        };



        lastDecision =
        decision;



        state.decisions++;


        state.timestamp =
        Date.now();




        if(bus){


            if(typeof bus.publish==="function"){

                bus.publish(
                    "elohim.decision",
                    decision
                );

            }

            else if(typeof bus.emit==="function"){

                bus.emit(
                    "elohim.decision",
                    decision
                );

            }

        }




        if(
            chronicle &&
            typeof chronicle.record==="function"
        ){

            chronicle.record(
                decision
            );

        }



        console.log(

            "[ELOHIM DECISION]",
            decision.action,
            decision.confidence

        );



        return decision;


    }





    function init(){


        if(!bus)
            return;



        if(typeof bus.subscribe==="function"){


            bus.subscribe(

                "sophia.signal",

                (signal)=>{

                    evaluate(
                        signal
                    );

                }

            );


        }


        else if(typeof bus.on==="function"){


            bus.on(

                "sophia.signal",

                (signal)=>{

                    evaluate(
                        signal
                    );

                }

            );


        }



        console.log(
            "[ELOHIM ONLINE]"
        );


    }





    return {


        init,


        evaluate,


        decide:evaluate,


        getDecision(){

            return lastDecision;

        },


        status(){

            return state;

        }


    };


}


module.exports =
createElohimOrchestrator;
