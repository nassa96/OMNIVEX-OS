/**
 * OMNIVEX OS PRIME
 *
 * DETERMINISTIC RUNTIME CONTROLLER
 *
 * SINGLE HEARTBEAT PIPELINE
 */

const Mercury =
  require("../../core/mercury");

const sophia =
  require("../../agents/sophia/sophiaEngine");

const saint =
  require("../../agents/saint/saintEngine");

const chronicle =
  require("../../chronicle/core/chronicleEngine");

const runtimeState =
  require("./runtimeState");


const mercury =
  new Mercury();



async function process(){


  try {


    /*
    =========================
    HEARTBEAT
    =========================
    */


    runtimeState.heartbeat();



    /*
    =========================
    MERCURY
    =========================
    */


    const market =
      await mercury.scan();



    if(!market){

      throw new Error(
        "NO MARKET DATA"
      );

    }



    /*
    =========================
    SOPHIA
    =========================
    */


    const signal =
      sophia.generateSignal(
        market
      );



    /*
    =========================
    ELOHIM
    =========================
    */


    const decision = {

      type:
        "elohim.decision",

      action:

        signal.confidence >= .70

        ? "EXECUTE"

        :

        signal.confidence >= .45

        ? "WAIT"

        :

        "HOLD",


      confidence:
        signal.confidence,


      source:
        "OMNIVEX_RUNTIME"

    };



    /*
    =========================
    AEGIS
    =========================
    */


    const risk = {

      action:

        signal.confidence >= .50

        ? "APPROVE"

        :

        "HOLD",


      confidence:
        signal.confidence

    };



    /*
    =========================
    SAINT
    =========================
    */


    const execution =
      saint.executeSignal(
        signal,
        market
      );



    /*
    =========================
    UPDATE CENTRAL STATE
    =========================
    */


    runtimeState.update({

      status:
        "ONLINE",

      market,

      signal,

      decision,

      risk,

      execution

    });



    /*
    =========================
    MEMORY
    =========================
    */


    chronicle.record(

      runtimeState.get()

    );



    const state =
      runtimeState.get();



    console.log(

      "[OMNIVEX HEARTBEAT]",

      "HB:",
      state.heartbeat,

      "|",

      decision.action,

      "|",

      execution.action

    );


    return state;



  }


  catch(err){


    console.error(

      "[RUNTIME CONTROLLER ERROR]",

      err.message

    );


    return runtimeState.get();


  }


}



function getState(){

  return runtimeState.get();

}



module.exports = {

  process,

  getState

};
