/**
 * OMNIVEX FORGE — STRATEGY OPTIMIZER
 * CommonJS runtime compatible
 *
 * Evolution scoring and strategy performance memory
 */


const performanceLedger = [];



function reportPerformance(strategyId, metrics = {}) {

    const report = {

        strategyId,

        metrics,

        timestamp: Date.now()

    };


    performanceLedger.push(
        report
    );


    return report;

}



function getPerformance(strategyId) {

    return performanceLedger.filter(
        item =>
            item.strategyId === strategyId
    );

}



function optimizeStrategy(strategy = {}) {

    const history =
        getPerformance(
            strategy.id
        );


    if (history.length === 0) {

        return {

            strategy,

            score: 0,

            mutation: "NEUTRAL"

        };

    }


    let score = 0;


    for (const item of history) {

        if (
            typeof item.metrics.score === "number"
        ) {

            score += item.metrics.score;

        }

    }


    score =
        score / history.length;



    let mutation = "HOLD";


    if (score > 0.7) {

        mutation = "PROMOTE";

    }


    if (score < 0.3) {

        mutation = "MUTATE";

    }



    return {

        strategy,

        score,

        mutation

    };

}



module.exports = {

    reportPerformance,

    getPerformance,

    optimizeStrategy

};
