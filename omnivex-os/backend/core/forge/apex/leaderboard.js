/**
 * APEX ALPHA ARENA
 * Competitive Ranking System
 */

class Leaderboard {


constructor(){

this.rankings=[];

}


update(results){

this.rankings = results.map(
(r,index)=>({

rank:index+1,

strategy:r.strategy,

score:r.score,

trades:r.trades

})
);

}


get(){

return this.rankings;

}


}


module.exports = Leaderboard;
