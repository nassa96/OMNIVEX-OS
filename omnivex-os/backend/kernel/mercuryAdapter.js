const eventBus = require("./eventBus");
const chronicle = require("./memory/chronicleStore");


const mercuryAdapter = {


    emit(type, event){

        const payload = {

            type,

            data:
            event?.data || event

        };


        if(
            eventBus &&
            typeof eventBus.publish === "function"
        ){

            return eventBus.publish(
                type,
                payload
            );

        }


        if(
            eventBus &&
            typeof eventBus.emit === "function"
        ){

            return eventBus.emit(
                type,
                payload
            );

        }


        return false;

    },



    on(type, handler){

        if(
            eventBus &&
            typeof eventBus.on === "function"
        ){

            return eventBus.on(
                type,
                handler
            );

        }


        if(
            eventBus &&
            typeof eventBus.subscribe === "function"
        ){

            return eventBus.subscribe(
                type,
                handler
            );

        }


        return false;

    },



    onAny(handler){

        if(
            eventBus &&
            typeof eventBus.onAny === "function"
        ){

            return eventBus.onAny(
                handler
            );

        }


        return false;

    },



    chronicle:{


        append(event){

            if(
                chronicle &&
                typeof chronicle.record === "function"
            ){

                return chronicle.record(
                    event
                );

            }


            return false;

        }


    }


};


module.exports = mercuryAdapter;
