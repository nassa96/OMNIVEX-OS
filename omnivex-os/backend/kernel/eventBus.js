/**
 * OMNIVEX OS PRIME
 *
 * GOVERNED EVENT BUS
 *
 * Single communication layer
 * between autonomous subsystems.
 */

const EventEmitter = require("events");

const {
    createEvent,
    isValidEvent
}
=
require("./eventContract");



class OmnivexEventBus extends EventEmitter {


    constructor(){

        super();

        this.setMaxListeners(500);

        this.events = 0;

    }



    publish(type, payload = {}){


        const event =
            createEvent({

                type,

                source:
                    payload.source ||
                    "unknown",


                authority:
                    payload.authority ||
                    null,


                route:
                    payload.route ||
                    [],


                data:
                    payload.data !== undefined
                    ?
                    payload.data
                    :
                    payload

            });



        if(!isValidEvent(event)){

            throw new Error(
                "INVALID OMNIVEX EVENT"
            );

        }



        this.events++;



        this.emit(
            type,
            event
        );



        this.emit(
            "*",
            event
        );



        return event;

    }



    subscribe(type, handler){


        if(
            typeof handler !== "function"
        ){

            return false;

        }


        this.on(
            type,
            handler
        );


        return true;

    }



    onAny(handler){


        if(
            typeof handler !== "function"
        ){

            return false;

        }


        this.on(
            "*",
            handler
        );


        return true;

    }



    stats(){


        return {

            events:
                this.events,


            listeners:
                this.eventNames().length,


            timestamp:
                Date.now()

        };


    }


}



module.exports =
    new OmnivexEventBus();
