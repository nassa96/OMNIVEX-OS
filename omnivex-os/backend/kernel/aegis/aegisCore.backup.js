/**
 * OMNIVEX OS PRIME
 *
 * AEGIS RISK AUTHORITY
 *
 * Pipeline:
 *
 * AURIN APPROVAL
 *        |
 *        v
 * AEGIS RISK CHECK
 *        |
 *        v
 * SAINT EXECUTION
 *
 * AEGIS NEVER CREATES SIGNALS.
 */


const eventBus =
    require("../eventBus");



class AegisCore {


    constructor(){


        this.state = {

            riskMode:
                "NORMAL",

            exposure:
                0,

            maxExposure:
                10000,

            blocked:
                false


        };


        this.initialized =
            false;


    }




    init(){


        if(this.initialized){
            return;
        }


        this.initialized =
            true;



            eventBus.subscribe(
    "aegis.evaluate",
    (event)=>{

        const signal =
            event.data?.signal ||
            event.signal ||
            null;


        const decision =
            this.evaluate(signal);


        this.route(
            decision,
            signal
        );

    }
);


            "aurin.execution.approved",

            event => {

                this.evaluateRequest(
                    event.data
                );

            }

        );



        console.log(
            "[AEGIS ONLINE]"
        );

    }





    evaluateRequest(order){


        const decision =
            this.evaluate(
                order
            );



        this.route(

            decision,

            order

        );


    }





    evaluate(order){


        if(!order){

            return {

                approved:false,

                reason:
                    "NO_ORDER"

            };

        }



        if(
            this.state.blocked
        ){

            return {

                approved:false,

                reason:
                    "SYSTEM_LOCKED"

            };

        }




        const confidence =
            Number(
                order.confidence || 0
            );




        if(
            confidence < 0.65
        ){

            return {

                approved:false,

                reason:
                    "LOW_CONFIDENCE"

            };

        }




        if(
            this.state.exposure >
            this.state.maxExposure
        ){

            return {

                approved:false,

                reason:
                    "EXPOSURE_LIMIT"

            };

        }




        return {

            approved:true,

            reason:
                "PASS",

            confidence

        };


    }





    route(decision, order){



        if(
            !decision.approved
        ){

            eventBus.publish(

                "aegis.rejected",

                {

                    order,

                    decision,

                    timestamp:
                        Date.now()

                }

            );


            console.log(

                "[AEGIS BLOCKED]",

                decision.reason

            );


            return;

        }




        const authorization = {


            ...order,


            aegis:
                decision,


            source:
                "AEGIS",


            timestamp:
                Date.now()

        };




        console.log(

            "[AEGIS APPROVED]",

            authorization.action,

            authorization.confidence

        );




        eventBus.publish(

            "aegis.approved",

            authorization

        );


        return authorization;


    }





    kill(){

        this.state.blocked =
            true;


        eventBus.publish(

            "aegis.kill",

            {

                timestamp:
                    Date.now()

            }

        );


    }





    reset(){

        this.state.blocked =
            false;


        this.state.exposure =
            0;


    }





    status(){

        return this.state;

    }


}



module.exports =
    new AegisCore();
