/**
 * OMNIVEX OS PRIME
 *
 * GOVERNED PIPELINE ROUTER
 *
 * Immutable intelligence flow:
 *
 * MERCURY
 *    |
 * SOPHIA
 *    |
 * ELOHIM
 *    |
 * AURIN
 *    |
 * AEGIS
 *    |
 * SAINT
 *    |
 * CHRONICLE
 */

const eventBus =
    require("../eventBus");



class PipelineRouter {


    constructor(){

        this.sequence = [

            "mercury.market",

            "sophia.signal",

            "elohim.decision",

            "aurin.evaluate",

            "aegis.evaluate",

            "saint.execution",

            "chronicle.record"

        ];


        this.active = true;

    }



    init(){


        eventBus.onAny(
            (event)=>{

                this.observe(
                    event
                );

            }
        );


        console.log(
            "[PIPELINE ROUTER ONLINE]"
        );

    }



    observe(event){


        if(!event){
            return;
        }


        const route =
            event.meta?.route || [];


        if(
            !route.includes(
                event.type
            )
        ){

            route.push(
                event.type
            );

        }


        event.meta.route =
            route;


    }



    publish(type,payload={}){


        if(!this.active){

            throw new Error(
                "PIPELINE ROUTER OFFLINE"
            );

        }



        return eventBus.publish(

            type,

            {

                ...payload,

                route:
                    [

                        ...(payload.route || []),

                        type

                    ]

            }

        );

    }



    status(){


        return {

            active:
                this.active,


            sequence:
                this.sequence,


            timestamp:
                Date.now()

        };


    }


}



module.exports =
    new PipelineRouter();
