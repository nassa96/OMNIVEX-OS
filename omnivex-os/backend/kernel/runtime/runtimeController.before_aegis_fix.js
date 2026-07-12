/**
 * OMNIVEX OS PRIME
 *
 * EVENT DRIVEN RUNTIME CONTROLLER
 *
 * Pipeline:
 *
 * MERCURY
 *    ↓
 * SOPHIA
 *    ↓
 * ELOHIM
 *    ↓
 * AURIN
 *    ↓
 * AEGIS
 *    ↓
 * SAINT
 *    ↓
 * CHRONICLE
 */


const Mercury =
    require("../../core/mercury");


const sophia =
    require("../../agents/sophia/sophiaEngine");


const aegis =
    require("../aegis/aegisCore");


const saint =
    require("../../agents/saint/saintEngine");


const chronicle =
    require("../../chronicle/core/chronicleEngine");


const runtimeState =
    require("./runtimeState");


const elohim =
    require("../elohimOrchestrator");


const eventBus =
    require("../eventBus");



const mercury =
    new Mercury();



let initialized = false;



function init(){

    if(initialized){
        return;
    }


    initialized = true;



    eventBus.subscribe(
        "market.tick",
        handleMarket
    );



    eventBus.subscribe(
        "sophia.signal",
        handleSignal
    );



    eventBus.subscribe(
        "elohim.decision",
        handleDecision
    );



    eventBus.subscribe(
        "aurin.execution.approved",
        handleGovernance
    );



    eventBus.subscribe(
        "aegis.approved",
        handleRiskApproval
    );


    console.log(
        "[RUNTIME EVENT PIPELINE ONLINE]"
    );

}



async function process(){

    runtimeState.heartbeat();


    const market =
        await mercury.scan();



    if(!market){

        return runtimeState.get();

    }



    eventBus.publish(
        "market.tick",
        market
    );


    return runtimeState.get();

}



function handleMarket(market){


    const signal =
        sophia.generateSignal(
            market
        );


    runtimeState.update({

        market,

        signal

    });



    eventBus.publish(
        "sophia.signal",
        signal
    );

}



function handleSignal(signal){


    const decision =
        elohim.evaluate(
            signal
        );



    runtimeState.update({

        decision

    });


}



function handleDecision(decision){


    eventBus.publish(

        "aurin.evaluate",

        decision

    );

}



function handleGovernance(approval){


    const risk =
        aegis.evaluate(
            approval
        );



    runtimeState.update({

        risk

    });



    if(
        risk.action === "REJECT"
    ){

        eventBus.publish(
            "aegis.rejected",
            {
                approval,
                risk
            }
        );


        return;

    }



    eventBus.publish(

        "aegis.approved",

        {

            ...approval,

            risk

        }

    );


}



function handleRiskApproval(order){


    const execution =
        saint.executeSignal(

            order,

            {
                symbol:
                    order.symbol
            }

        );



    runtimeState.update({

        execution

    });



    chronicle.record(

        runtimeState.get()

    );



    eventBus.publish(

        "saint.execution",

        execution

    );


}



function getState(){

    return runtimeState.get();

}



module.exports = {

    init,

    process,

    getState

};
