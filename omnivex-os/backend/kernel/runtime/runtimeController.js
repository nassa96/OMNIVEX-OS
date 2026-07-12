/**
 * FILE:
 * backend/kernel/runtime/runtimeController.js
 *
 * OMNIVEX OS PRIME
 *
 * Runtime orchestration controller
 */

const eventBus =
    require("../eventBus");


const runtimeState =
    require("./runtimeState");



function handleDecision(decision){


    eventBus.publish(

        "aurin.evaluate",

        {

            source:
                "ELOHIM",

            data:
                decision

        }

    );


}



function handleGovernance(approval){


    eventBus.publish(

        "aegis.evaluate",

        {

            source:
                "RUNTIME_CONTROLLER",

            signal:
                approval

        }

    );


}



function init(){


    eventBus.subscribe(

        "elohim.decision",

        (event)=>{


            handleDecision(

                event.data ||
                event

            );


        }

    );



    eventBus.subscribe(

        "governance.request",

        (event)=>{


            handleGovernance(

                event.data ||
                event

            );


        }

    );



    console.log(

        "[RUNTIME CONTROLLER ONLINE]"

    );

}



function status(){


    return {

        status:
            "ONLINE"

    };

}



module.exports = {

    init,

    status,

    handleDecision,

    handleGovernance

};
