class SophiaSignalEngine {

  constructor(){

    this.lastSignalTime = {};

    this.minIntervalMs = 5000;

  }


  generate({symbol, price, volume = 0}){


    if(!symbol || typeof price !== "number"){
      return null;
    }


    const now = Date.now();



    if(
      this.lastSignalTime[symbol] &&
      now - this.lastSignalTime[symbol] < this.minIntervalMs
    ){

      return null;

    }



    this.lastSignalTime[symbol] = now;



    const side =
      volume > 0
      ? "BUY"
      : "HOLD";



    if(side === "HOLD"){
      return null;
    }



    return {

      symbol,

      side,

      confidence:0.65,

      strength:"MEDIUM",

      reason:"VOLUME_TRIGGER",

      timestamp:now

    };


  }


}


module.exports =
new SophiaSignalEngine();

