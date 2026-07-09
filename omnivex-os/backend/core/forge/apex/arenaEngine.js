/**
 * OMNIVEX FORGE
 * APEX ALPHA ARENA ENGINE
 *
 * Strategy competition orchestrator
 * Uses existing:
 * FORGE
 * CHRONICLE
 * WAR
 * PROMOTION
 */

const CandidatePool = require("./candidatePool");
const BattleRunner = require("./battleRunner");
const Leaderboard = require("./leaderboard");

class ApexArena {

constructor({forge, chronicle, war}){

this.forge = forge;
this.chronicle = chronicle;
this.war = war;

this.pool = new CandidatePool();
this.battle = new BattleRunner();
this.leaderboard = new Leaderboard();

this.status = "ONLINE";

}


register(strategy){

return this.pool.add(strategy);

}


async run(){

const candidates = this.pool.list();

const results = [];

for(const strategy of candidates){

const result = await this.battle.evaluate(
strategy,
this.chronicle
);

results.push(result);

}


results.sort(
(a,b)=>b.score-a.score
);


this.leaderboard.update(results);


return {

arena:"APEX_ALPHA_ARENA",

status:"COMPLETE",

competitors:candidates.length,

winner:results[0] || null,

leaderboard:this.leaderboard.get()

};

}


state(){

return {

status:this.status,

competitors:this.pool.list().length,

leaderboard:this.leaderboard.get()

};

}


}


module.exports = ApexArena;
