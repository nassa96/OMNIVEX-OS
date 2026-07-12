/**
 * OMNIVEX OS PRIME
 *
 * SAINT EXECUTION ENGINE
 *
 * Execution authority.
 *
 * Rules:
 *
 * - Cannot create decisions.
 * - Cannot bypass governance.
 * - Executes only approved orders.
 */

const eventBus =
    require("../eventBus");


const chronicle =
    require("../memory/chronicleStore");



class SaintExecutionEngine {


    constructor(){


        this.executions =
            new Map();


        this.state = {

            status:
                "READY",

            executed:
                0,

            rejected:
                0

        };


        this.init();

    }



    init(){


        eventBus.subscribe(

            "saint.execution.request",

            (event)=>{


                this.execute(

                    event.data ||
                    event

                );


            }

        );



        console.log(
            "[SAINT EXECUTION ONLINE]"
        );

    }



    execute(order){


        const validation =
            this.validate(order);



        if(!validation.valid){


            const failure = {


                type:
                    "saint.execution.rejected",


                reason:
                    validation.reason,


                order,


                timestamp:
                    Date.now()


            };



            this.state.rejected++;



            chronicle.record(
                failure
            );



            eventBus.publish(

                "saint.execution.rejected",

                {

                    source:
                        "SAINT",

                    data:
                        failure

                }

            );



            return failure;

        }



        const execution = {


            id:
                this.createId(),


            type:
                "saint.execution",


            action:
                order.action,


            symbol:
                order.symbol ||
                "BTC",


            confidence:
                order.confidence ||
                0,


            status:
                "EXECUTED",


            source:
                "SAINT",


            governance:
                {

                    aegis:
                        order.aegis,


                    aurin:
                        order.aurin

                },


            timestamp:
                Date.now()

        };



        this.executions.set(

            execution.id,

            execution

        );



        this.state.executed++;



        chronicle.record(
            execution
        );



        eventBus.publish(

            "saint.execution",

            {

                source:
                    "SAINT",

                data:
                    execution

            }

        );



        console.log(

            "[SAINT EXECUTED]",

            execution.action,

            execution.symbol

        );



        return execution;


    }




    validate(order){


        if(!order){


            return {

                valid:false,

                reason:
                    "EMPTY_ORDER"

            };

        }



        if(
            ![
                "BUY",
                "SELL"
            ].includes(
                order.action
            )
        ){


            return {

                valid:false,

                reason:
                    "INVALID_ACTION"

            };


        }



        if(
            Number(order.confidence || 0)
            < 0.65
        ){


            return {

                valid:false,

                reason:
                    "LOW_CONFIDENCE"

            };


        }



        if(
            !order.aegis ||
            order.aegis.approved !== true
        ){


            return {

                valid:false,

                reason:
                    "AEGIS_AUTHORIZATION_REQUIRED"

            };

        }



        if(
            !order.aurin ||
            order.aurin.source !== "AURIN"
        ){


            return {

                valid:false,

                reason:
                    "AURIN_AUTHORIZATION_REQUIRED"

            };

        }



        return {

            valid:true

        };


    }




    createId(){


        return (

            "SAINT-" +

            Date.now() +

            "-" +

            Math.floor(
                Math.random()*10000
            )

        );


    }




    status(){


        return this.state;


    }


}



module.exports =
    new SaintExecutionEngine();
