/**
 * OMNIVEX FORGE — SCORING ENGINE
 * CommonJS runtime compatible
 */


function scoreStrategy(events = []) {

    if (!Array.isArray(events) || events.length === 0) {

        return {
            trades: 0,
            avgPnl: 0,
            score: 0
        };

    }


    let pnlSum = 0;
    let trades = 0;


    for (const event of events) {

        if (typeof event.pnl === "number") {

            pnlSum += event.pnl;
            trades++;

        }

    }


    const avgPnl =
        trades > 0
        ? pnlSum / trades
        : 0;


    return {

        trades,

        avgPnl,

        score:
            avgPnl *
            Math.log(trades + 1)

    };

}


module.exports = {
    scoreStrategy
};
