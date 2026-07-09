/**
 * OMNIVEX OS
 * RUNTIME STATE API GATEWAY
 *
 * Single source of truth endpoint
 *
 * ATLAS Terminal
 *        |
 *        v
 * /api/runtime/state
 *        |
 *        v
 * OMNIVEX RUNTIME HEARTBEAT
 */

const runtime =
  require("../../kernel/runtime/omnivexRuntime");


function runtimeState(req, res) {

  try {

    const state = runtime.status();


    res.json({

      system: "OMNIVEX_OS",

      status: "ONLINE",

      runtime: {

        heartbeat:
          state.heartbeat,

        timestamp:
          state.timestamp

      },


      market:
        state.lastMarket || null,


      intelligence:
        state.lastSignal || null,


      decision:
        state.lastDecision || null,


      risk:
        state.lastRisk || null,


      execution:
        state.lastExecution || null,


      memory: {

        active: true,

        source:
          "CHRONICLE"

      }

    });


  } catch(err) {


    console.error(
      "[RUNTIME STATE API ERROR]",
      err.message
    );


    res.status(500).json({

      system:
        "OMNIVEX_OS",

      status:
        "ERROR",

      error:
        err.message

    });


  }

}


module.exports = runtimeState;
