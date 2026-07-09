/**
 * OMNIVEX OS PRIME
 *
 * RUNTIME AGENT REGISTRY
 *
 * SINGLE SOURCE OF TRUTH
 */


const agents = {};



function register(
 name,
 instance={}
){

 agents[name]={
   name,
   status:"ONLINE",
   registered:Date.now(),
   instance
 };


 console.log(
   "[RUNTIME REGISTRY]",
   "REGISTERED:",
   name
 );


}



function list(){

 return Object.values(
   agents
 ).map(agent=>({

   name:agent.name,
   status:agent.status,
   registered:agent.registered

 }));

}



function get(name){

 return agents[name] || null;

}



function state(){

 return {

   total:
   Object.keys(agents).length,

   agents:list(),

   timestamp:
   Date.now()

 };

}



module.exports={

 register,

 list,

 get,

 state

};
