/**
 * OMNIVEX OS PRIME
 *
 * ELOHIM ORCHESTRATOR
 *
 * Decision authority layer.
 *
 * Receives:
 * SOPHIA SIGNAL
 *
 * Emits:
 * ELOHIM DECISION
 *
 * No execution authority.
 */


function createElohimOrchestrator({

    bus,

    chronicle,

    ledger

} = {}){


    let lastDecision = null;



    const state = {

        mode:
            "LIVE",

        decisions:
            0,

        timestamp:
            null

    };



    function normalize(event){

        if(
            event &&
            event.data
        ){

            return event.data;

        }


        return event;

    }




    function evaluate(input){


        const signal =
            normalize(input);



        if(!signal){

            return emitDecision({

                action:
                    "WAIT",

                confidence:
                    0

            });

        }



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



        return emitDecision({

            action,

            confidence,

            symbol:
                signal.symbol ||
                "BTC"

        });



    }




    function emitDecision(data){


        const decision = {


            type:
                "elohim.decision",


            action:
                data.action,


            confidence:
                data.confidence,


            symbol:
                data.symbol ||
                "BTC",


            source:
                "ELOHIM",


            timestamp:
                Date.now()

        };



        lastDecision =
            decision;



        state.decisions++;


        state.timestamp =
            Date.now();



        if(bus){

            bus.publish(

                "elohim.decision",

                decision

            );

        }



        if(
            chronicle &&
            typeof chronicle.record === "function"
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


        if(!bus){
            return;
        }



        bus.subscribe(

            "sophia.signal",

            evaluate

        );



        console.log(

            "[ELOHIM ONLINE]"

        );

    }





    return {


        init,


        evaluate,


        decide:
            evaluate,


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
