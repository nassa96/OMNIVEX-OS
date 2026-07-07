/**
 * SOPHIA BRIDGE
 * SAINT PRIMAL v13
 *
 * MERCURY -> SOPHIA -> CHRONICLE
 */

const sophia =
require("./engines/sophiaSignalEngine.cjs");

let chronicle = null;

try {
  chronicle =
  require("../chronicle/chronicle.cjs");
}
catch(err){
  console.log("[SOPHIA] CHRONICLE WAITING");
}


class SophiaBridge {


  connect(bus){

    if(!bus){
      console.log("[SOPHIA] BUS MISSING");
      return;
    }


    bus.subscribe((event)=>{

      this.process(event);

    });


    console.log("[SOPHIA] MERCURY LINKED");

  }



  process(event){

    const payload =
    event.payload || event;


    if(
      !payload.symbol ||
      typeof payload.price !== "number"
    ){
      return;
    }


    const signal =
    sophia.generate({

      symbol: payload.symbol,

      price: payload.price,

      volume: payload.volume || 0

    });


    if(!signal){
      return;
    }


    if(signal.side === "HOLD"){
      return;
    }


    const record = {

      type: "SIGNAL",

      symbol: signal.symbol,

      payload: signal,

      source: "SOPHIA",

      timestamp: Date.now()

    };


    console.log(
      `[SOPHIA SIGNAL] ${signal.side} ${signal.symbol}`
    );


    if(
      chronicle &&
      typeof chronicle.write === "function"
    ){

      chronicle.write(record);

    }


    return record;

  }


}


module.exports =
new SophiaBridge();

