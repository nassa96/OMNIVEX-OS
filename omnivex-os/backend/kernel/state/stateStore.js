class StateStore {

    constructor(){

        this.state = {

            system:
            "OMNIVEX_OS_PRIME",

            status:
            "OFFLINE",

            heartbeat:
            0,

            market:{},

            signal:{},

            decision:{},

            risk:{},

            execution:{},

            agents:{},

            timestamp:
            Date.now()

        };

    }


    update(key,value){

        this.state[key] = value;

        return this.state[key];

    }


    online(){

        this.state.status = "ONLINE";

        this.state.heartbeat += 1;

        this.state.timestamp =
        Date.now();

    }


    offline(){

        this.state.status = "OFFLINE";

        this.state.timestamp =
        Date.now();

    }


    get(){

        return this.state;

    }


    reset(){

        this.state = {

            system:
            "OMNIVEX_OS_PRIME",

            status:
            "OFFLINE",

            heartbeat:0,

            market:{},

            signal:{},

            decision:{},

            risk:{},

            execution:{},

            agents:{},

            timestamp:
            Date.now()

        };

    }

}


module.exports =
new StateStore();
