const eventBus = require("../eventBus");
const chronicle = require("../memory/chronicleStore");


class SaintExecutionEngine {


    constructor(){

        this.executions=new Map();

        this.state={
            status:"READY",
            executed:0,
            rejected:0
        };


        this.init();

    }



    init(){

        eventBus.subscribe(
            "saint.execution.request",
            execution=>{

                this.execute(
                    execution
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

            const failure={

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
                failure
            );


            return failure;

        }



        const execution={

            id:this.createId(),

            type:
                "saint.execution",

            action:
                order.action,

            symbol:
                order.symbol || "BTC",

            confidence:
                order.confidence || 0,


            status:
                "EXECUTED",


            source:
                "SAINT",


            governance:
                order.governance || {},


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
            execution
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
                reason:"EMPTY_ORDER"
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
                reason:"INVALID_ACTION"
            };

        }


        if(
            Number(order.confidence || 0)
            < 0.65
        ){

            return {
                valid:false,
                reason:"LOW_CONFIDENCE"
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


module.exports = new SaintExecutionEngine();
