const express = require("express");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");


const runtime = require("./kernel/runtime/omnivexRuntime");
const agentRegistry = require("./kernel/registry/registerAgents");


const app = express();

app.use(cors());
app.use(express.json());



const server = http.createServer(app);



const wss = new WebSocket.Server({
    server
});



wss.on("connection",(ws)=>{

    console.log("[WS] CLIENT CONNECTED");


    ws.send(JSON.stringify({

        type:"VEYRONIX_CONNECTED",

        system:"OMNIVEX_OS_PRIME",

        timestamp:Date.now()

    }));

});





// ======================================
// HEALTH
// ======================================

app.get(
"/health",
(req,res)=>{


    const state = runtime.status();


    res.json({

        system:"VEYRONIX_ENGINE",

        kernel:"OMNIVEX_OS_PRIME",

        status:state.status,

        heartbeat:state.heartbeat,

        agents:Object.keys(
            state.agents || {}
        ).length,

        market:state.market,

        signal:state.signal,

        risk:state.risk,

        execution:state.execution,

        timestamp:Date.now()

    });


});






// ======================================
// RUNTIME STATE
// ======================================


app.get(
"/api/runtime/state",
(req,res)=>{


    res.json({

        system:"OMNIVEX_OS_PRIME",

        runtime:
        runtime.status()

    });


});







// ======================================
// RUNTIME AGENTS
// FULL 16 AGENT RUNTIME VIEW
// ======================================


app.get(
"/api/runtime/agents",
(req,res)=>{


try{


    const state =
    runtime.status();



    res.json({


        total:
        Object.keys(
            state.agents || {}
        ).length,



        agents:


        Object.entries(
            state.agents || {}
        )
        .map(([name,data])=>({


            name,


            status:
            data.status,


            role:
            data.role,


            heartbeat:
            data.heartbeat ||
            "ONLINE"


        })),



        timestamp:
        Date.now()


    });



}

catch(err){


    res.status(500).json({

        error:
        err.message

    });


}


});







// ======================================
// SYSTEM INFO
// ======================================


app.get(
"/api/system",
(req,res)=>{


res.json({

    name:"VEYRONIX",

    engine:
    "OMNIVEX_OS_PRIME",

    runtime:
    runtime.status(),

    timestamp:
    Date.now()


});


});







// ======================================
// START
// ======================================


const PORT =
process.env.PORT || 3000;



server.listen(
PORT,
()=>{


console.log(`
=================================
 VEYRONIX INTELLIGENCE ENGINE
 OMNIVEX OS PRIME CORE ONLINE
 RUNTIME HEARTBEAT ACTIVE
 API PORT: ${PORT}
=================================
`);



runtime.start();



});

