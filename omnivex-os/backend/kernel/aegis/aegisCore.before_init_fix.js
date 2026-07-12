const eventBus = require("../eventBus");
const chronicle = require("../memory/chronicleStore");


class AegisCore {


    constructor(){

        this.initialized = false;

        this.state = {

            status:"BOOTING",

            approved:0,

            blocked:0

        };

    }



    init(){

        if(this.initialized){

            return;

        }


        this.initialized = true;


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



        eventBus.subscribe(

            "aurin.execution.approved",

            (event)=>{


                this.evaluateRequest(

                    event.data

                );


            }

        );



        this.state.status = "ONLINE";


        console.log(

            "[AEGIS ONLINE]"

        );

    }




    evaluate(signal){


        if(!signal){

            return {

                approved:false,

                reason:"NO_SIGNAL"

            };

        }



        const action =

            signal.action;



        const confidence =

            Number(

                signal.confidence || 0

            );



        if(

            !["BUY","SELL"]

            .includes(action)

        ){

            return {

                approved:false,

                reason:"INVALID_ACTION"

            };

        }



        if(confidence < 0.65){

            return {

                approved:false,

                reason:"LOW_CONFIDENCE"

            };

        }



        return {

            approved:true,

            action,

            confidence,

            symbol:

                signal.symbol || "BTC"

        };

    }




    evaluateRequest(order){


        const decision =

            this.evaluate(order);



        this.route(

            decision,

            order

        );

    }




    route(decision,request){


        if(!decision.approved){


            this.state.blocked++;



            const blocked = {

                type:"aegis.blocked",

                source:"AEGIS",

                reason:

                    decision.reason,

                decision,

                request,

                timestamp:

                    Date.now()

            };



            chronicle.record(

                blocked

            );



            eventBus.publish(

                "aegis.blocked",

                {

                    source:"AEGIS",

                    data:blocked

                }

            );


            console.log(

                "[AEGIS BLOCKED]",

                decision.reason

            );


            return blocked;

        }




        this.state.approved++;



        const approved = {


            type:"aegis.approved",

            source:"AEGIS",

            action:

                decision.action,

            confidence:

                decision.confidence,

            symbol:

                decision.symbol,

            timestamp:

                Date.now()

        };



        chronicle.record(

            approved

        );



        eventBus.publish(

            "aegis.approved",

            {

                source:"AEGIS",

                data:approved

            }

        );



        console.log(

            "[AEGIS APPROVED]",

            approved.action,

            approved.symbol

        );



        return approved;

    }




    status(){

        return this.state;

    }


}



module.exports = new AegisCore();
