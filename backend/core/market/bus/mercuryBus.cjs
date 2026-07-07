/**
 * MERCURY EVENT BUS
 * SAINT PRIMAL v13
 *
 * MARKET EVENTS
 *       ↓
 * MERCURY
 *       ↓
 * SOPHIA / CHRONICLE / SAINT
 */

class MercuryBus {

  constructor(){

    this.subscribers = [];

    console.log(
      "[MERCURY] BUS INITIALIZED"
    );

  }


  subscribe(handler){

    if(typeof handler !== "function"){
      return;
    }

    this.subscribers.push(handler);

    console.log(
      `[MERCURY] subscriber linked: ${this.subscribers.length}`
    );

  }



  publish(event){

    if(!event){
      return;
    }


    const normalized = {

      type:
        event.type || "trade",

      symbol:
        event.symbol ||
        event.payload?.symbol ||
        "UNKNOWN",

      payload:
        event.payload || event,

      source:
        event.source ||
        "market",

      timestamp:
        Date.now()

    };


    for(const subscriber of this.subscribers){

      try{

        subscriber(normalized);

      }catch(err){

        console.log(
          "[MERCURY ERROR]",
          err.message
        );

      }

    }


  }

}


module.exports =
new MercuryBus();

