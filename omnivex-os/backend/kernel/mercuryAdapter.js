const eventBus = require("./eventBus");
const chronicle = require("./memory/chronicleStore");

const mercuryBusAdapter = {

    emit(type, event){

        return eventBus.publish(
            type,
            event
        );

    },


    onAny(handler){

        eventBus.debug(
            handler
        );

    },


    chronicle: {

        append(event){

            return chronicle.record(
                event
            );

        }

    }

};


module.exports = mercuryBusAdapter;
