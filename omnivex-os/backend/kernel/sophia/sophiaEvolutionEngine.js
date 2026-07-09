const eventBus = require("../eventBus");
const Tartarus = require("../tartarus/tartarusEngine");

/**
 * OMNIVEX OS — SOPHIA INTELLIGENCE ENGINE
 *
 * Responsibilities:
 * - consume MERCURY market.tick events
 * - analyze momentum/trend
 * - generate adaptive strategies
 * - emit sophia.signal
 * - evolve strategy pool
 */


class SophiaEvolutionEngine {


    constructor(){

        this.strategyPool = [];

        this.activeStrategy = null;

        this.marketState = {};

        this.history = [];

    }




    init(){

        eventBus.subscribe(
            "market.tick",
            (tick)=>{

                this.marketState =
                tick.data || tick;

                this.history.push(
                    this.marketState
                );


                if(this.history.length > 50){
                    this.history.shift();
                }


                this.analyze();

                this.evolve();

            }
        );



        eventBus.subscribe(
            "tartarus.update",
            (update)=>{

                this.applyLearning(update);

            }
        );


        console.log(
            "[SOPHIA ONLINE]"
        );

    }







    analyze(){

        const market =
        this.marketState;


        const price =
        Number(
            market.price || 0
        );


        const previous =
        this.history.length > 1
        ?
        Number(
            this.history[
                this.history.length - 2
            ].price || price
        )
        :
        price;



        let change = 0;


        if(previous > 0){

            change =
            (price - previous)
            /
            previous;

        }



        let action="HOLD";


        let confidence=0.5;



        if(change > 0.001){

            action="BUY";

            confidence =
            Math.min(
                0.95,
                0.5 + Math.abs(change)*100
            );

        }



        if(change < -0.001){

            action="SELL";

            confidence =
            Math.min(
                0.95,
                0.5 + Math.abs(change)*100
            );

        }




        const signal={

            type:
            "sophia.signal",


            action,


            confidence:
            Number(
                confidence.toFixed(3)
            ),


            symbol:
            market.asset ||
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



        return signal;

    }







    evolve(){


        if(!this.marketState)
            return;



        const strategy =
        this.generateStrategy(
            this.marketState
        );



        this.strategyPool.push(
            strategy
        );



        if(this.strategyPool.length > 20){

            this.strategyPool.shift();

        }



        this.activeStrategy =
        this.selectBestStrategy();



        eventBus.publish(
            "sophia.strategy",
            this.activeStrategy
        );


    }







    generateStrategy(market){


        const volatility =
        Math.random();



        let bias=0;


        let threshold=0.5;



        if(volatility > .6){

            bias=1;

            threshold=.6;

        }


        if(volatility < .3){

            bias=.3;

            threshold=.4;

        }



        return {

            type:
            "adaptive",


            bias,


            risk:
            volatility,


            threshold,


            symbol:
            market.asset || "BTC"

        };


    }







    applyLearning(update){


        if(!update)
            return;



        const state =
        update.strategyState;



        if(!state)
            return;



        if(state.bias < .8){

            this.increaseConservatism();

        }


        if(state.bias > 1.5){

            this.increaseAggression();

        }


    }







    increaseConservatism(){


        this.strategyPool.forEach(
            s=>{

                s.threshold += .02;

                s.bias *= .95;

            }
        );


    }






    increaseAggression(){


        this.strategyPool.forEach(
            s=>{

                s.threshold -= .02;

                s.bias *= 1.05;

            }
        );


    }








    selectBestStrategy(){


        if(
            this.strategyPool.length===0
        )
            return null;



        return this.strategyPool.reduce(
            (best,current)=>{


                const a =
                Math.abs(best.bias)
                /
                (best.threshold+.01);



                const b =
                Math.abs(current.bias)
                /
                (current.threshold+.01);



                return b>a
                ?
                current
                :
                best;


            }
        );


    }







    getActiveStrategy(){

        return this.activeStrategy;

    }


}



module.exports =
new SophiaEvolutionEngine();
