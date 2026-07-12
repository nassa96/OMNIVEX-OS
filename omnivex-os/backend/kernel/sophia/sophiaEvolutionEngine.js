/**
 * OMNIVEX OS PRIME
 *
 * SOPHIA EVOLUTION ENGINE
 *
 * Market intelligence and signal generation layer.
 */

const eventBus = require("../eventBus");

class SophiaEvolutionEngine {

    constructor(){

        this.strategyPool = [];

        this.activeStrategy = null;

        this.marketState = {};

        this.history = [];

        this.initialized = false;

    }


    init(){

        if(this.initialized){
            return;
        }


        this.initialized = true;


        const handler = (event)=>{

            const market =
                event.data || event;


            if(!market.price){
                return;
            }


            this.marketState = market;


            this.history.push(
                market
            );


            if(this.history.length > 50){

                this.history.shift();

            }


            this.analyze();

            this.evolve();

        };


        eventBus.subscribe(
            "market.tick",
            handler
        );


        eventBus.subscribe(
            "mercury.tick",
            handler
        );


        console.log(
            "[SOPHIA ONLINE]"
        );

    }



    analyze(){

        const market =
            this.marketState || {};


        const price =
            Number(
                market.price || 0
            );


        const previous =
            this.history.length > 1
                ? Number(
                    this.history[
                        this.history.length - 2
                    ].price || price
                )
                : price;


        let change = 0;


        if(previous){

            change =
                (price - previous) /
                previous;

        }


        let action =
            "HOLD";


        let confidence =
            0.5;



        if(change > 0.001){

            action =
                "BUY";

            confidence =
                0.95;

        }


        if(change < -0.001){

            action =
                "SELL";

            confidence =
                0.95;

        }



        const signal = {

            source:
                "SOPHIA",

            authority:
                "SOPHIA_ENGINE",


            action,

            confidence,


            symbol:
                market.asset ||
                market.symbol ||
                "BTC",


            price,


            change,


            timestamp:
                Date.now()

        };



        eventBus.publish(

            "sophia.signal",

            signal

        );


        console.log(

            "[SOPHIA SIGNAL]",

            action,

            confidence

        );


        return signal;

    }



    evolve(){

        const strategy = {

            timestamp:
                Date.now(),


            market:
                this.marketState,


            historySize:
                this.history.length

        };


        this.strategyPool.push(
            strategy
        );


        if(this.strategyPool.length > 100){

            this.strategyPool.shift();

        }


        this.activeStrategy =
            strategy;


    }



    status(){

        return {

            initialized:
                this.initialized,


            strategies:
                this.strategyPool.length,


            history:
                this.history.length,


            activeStrategy:
                this.activeStrategy,

            timestamp:
                Date.now()

        };

    }

}



const sophia =
    new SophiaEvolutionEngine();


module.exports =
    sophia;


sophia.init();
