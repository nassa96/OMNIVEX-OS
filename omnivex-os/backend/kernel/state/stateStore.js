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


            forge:{},


            runtime:{


                heartbeat:
                0,


                lastTick:
                Date.now()

            },


            timestamp:
            Date.now()


        };


    }





    update(key,value){


        this.state[key] = value;


        return value;


    }





    online(){


        this.state.status =
        "ONLINE";


        this.state.heartbeat++;


        this.state.runtime.heartbeat =
        this.state.heartbeat;


        this.state.runtime.lastTick =
        Date.now();


        this.state.timestamp =
        Date.now();


    }





    offline(){


        this.state.status =
        "OFFLINE";


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


            heartbeat:
            0,


            market:{},


            signal:{},


            decision:{},


            risk:{},


            execution:{},


            agents:{},


            forge:{},


            runtime:{


                heartbeat:
                0,


                lastTick:
                Date.now()

            },


            timestamp:
            Date.now()


        };


    }


}


module.exports =
new StateStore();
