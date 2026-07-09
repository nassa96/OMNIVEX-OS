/**
 * OMNIVEX FORGE — EVOLUTION CONTROLLER
 * CommonJS Runtime Compatible
 */

const { scoreStrategy } =
require("../scoringEngine");

const { loadReplay } =
require("../replayEngine");

const {
    optimizeStrategy
} =
require("../strategyOptimizer");



class EvolutionController {


    constructor(){

        this.population = [];

        this.generation = 0;

    }



    evolve(){


        const history =
        loadReplay();



        if(
            !history ||
            history.length === 0
        ){

            return {

                generation:
                this.generation,

                population:
                0,

                status:
                "WAITING_FOR_DATA"

            };

        }



        const scored =
        history.map(strategy=>{


            const score =
            scoreStrategy(
                strategy.events || []
            );


            return {

                strategy,

                ...score,

                optimization:
                optimizeStrategy(
                    strategy
                )

            };


        });



        scored.sort(
            (a,b)=>
            b.score-a.score
        );



        const survivors =
        scored.slice(0,5);



        this.population =
        survivors;



        this.generation++;



        return {

            generation:
            this.generation,


            survivors,


            population:
            this.population.length,


            status:
            "EVOLVED"

        };


    }


}



module.exports =
EvolutionController;
