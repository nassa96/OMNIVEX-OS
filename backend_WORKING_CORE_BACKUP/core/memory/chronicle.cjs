/**
 * CHRONICLE MEMORY CORE
 * SAINT PRIMAL v13
 *
 * Event persistence layer
 * Receives:
 * TRADE
 * SIGNAL
 * RISK
 * EXECUTION
 */

class Chronicle {

  constructor() {
    this.events = [];
    this.maxEvents = 5000;

    console.log("[CHRONICLE] MEMORY CORE ONLINE");
  }


  record(event = {}) {

    const entry = {
      id: "CHR_" + Math.random().toString(36).substring(2,10).toUpperCase(),

      timestamp: Date.now(),

      type: event.type || "UNKNOWN",

      symbol:
        event.symbol ||
        event.payload?.symbol ||
        "UNKNOWN",

      payload: event.payload || event,

      source:
        event.source ||
        "internal",

      metadata:
        event.metadata ||
        {}
    };


    this.events.push(entry);


    if(this.events.length > this.maxEvents){
      this.events.shift();
    }


    console.log(
      `[CHRONICLE] ${entry.type} ${entry.symbol}`
    );


    return entry;
  }



  getAll(){

    return {
      total:this.events.length,
      data:this.events
    };

  }



  getByType(type){

    const filtered =
      this.events.filter(
        e =>
        e.type === type
      );


    return {
      type,
      count:filtered.length,
      data:filtered
    };

  }

}


module.exports = new Chronicle();
