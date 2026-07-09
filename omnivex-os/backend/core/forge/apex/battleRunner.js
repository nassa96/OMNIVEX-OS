/**
 * APEX ALPHA ARENA
 * Strategy Battle Simulator
 */

const crypto = require("crypto");


class BattleRunner {


async evaluate(strategy,chronicle){

const seed =
crypto
.createHash("sha256")
.update(JSON.stringify(strategy))
.digest("hex");


const score =
parseInt(seed.substring(0,8),16)
/
0xffffffff;


return {

strategy:

strategy.name ||
"UNKNOWN",

score,

trades:

Math.floor(score*100),

source:

"APEX_ALPHA_ARENA",

timestamp:

Date.now()

};


}


}


module.exports = BattleRunner;
