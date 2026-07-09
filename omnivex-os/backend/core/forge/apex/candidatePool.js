/**
 * APEX ALPHA ARENA
 * Strategy Candidate Registry
 */

class CandidatePool {


constructor(){

this.candidates=[];

}


add(strategy){

this.candidates.push({

...strategy,

created:Date.now()

});


return strategy;

}


list(){

return this.candidates;

}


clear(){

this.candidates=[];

}


}


module.exports = CandidatePool;
