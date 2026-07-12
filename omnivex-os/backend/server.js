require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { WebSocketServer } = require("ws");

const eventBus = require("./kernel/eventBus");

// Core runtime
const runtime = require("./kernel/runtime/omnivexRuntime");

// Feed layer
const feedManager = require("./kernel/feeds/feedManager");

// Governance chain
require("./kernel/runtime/elohimRuntimeBridge");
require("./kernel/aurin/aurinCore");
require("./kernel/aegis/aegisCore");
require("./kernel/saint/saintExecutionEngine");

// Memory layer
const chronicle = require("./kernel/memory/chronicleStore");


const app = express();

app.use(cors());
app.use(express.json());


// =====================================
// HEALTH
// =====================================

app.get(
    "/health",
    (req,res)=>{

        res.json({

            system:
                "OMNIVEX_OS_PRIME",

            status:
                "ONLINE",

            heartbeat:
                runtime.status().heartbeat || null,

            events:
                eventBus.stats(),

            chronicle:
                chronicle.latest(),

            timestamp:
                Date.now()

        });

    }
);


// =====================================
// STATE
// =====================================

app.get(
    "/state",
    (req,res)=>{

        res.json(
            runtime.status()
        );

    }
);


// =====================================
// PRIME-16 AGENT API
// =====================================

app.get(
    "/api/runtime/agents",
    (req,res)=>{

        const agents =
            runtime.status().agents || {};


        res.json({

            system:
                "OMNIVEX_OS_PRIME",

            architecture:
                "PRIME-16_AGENT_RUNTIME",

            total:
                Object.keys(agents).length,

            agents,

            timestamp:
                Date.now()

        });

    }
);


// =====================================
// SERVER START
// =====================================

const PORT =
    process.env.PORT || 3000;


const server =
    app.listen(
        PORT,
        ()=>{

            console.log(
                "================================="
            );

            console.log(
                "VEYRONIX INTELLIGENCE ENGINE"
            );

            console.log(
                "OMNIVEX OS PRIME CORE ONLINE"
            );

            console.log(
                "RUNTIME HEARTBEAT ACTIVE"
            );

            console.log(
                "API PORT:",
                PORT
            );

            console.log(
                "================================="
            );


            try{

                feedManager.start();

                runtime.init();

                runtime.start();

            }
            catch(error){

                console.error(
                    "[BOOT ERROR]",
                    error.message
                );

            }

        }
);


// =====================================
// ATLAS WEBSOCKET BRIDGE
// =====================================

const wss =
    new WebSocketServer({
        server
    });


wss.on(
    "connection",
    (socket)=>{

        console.log(
            "[ATLAS WS CONNECTED]"
        );


        socket.send(
            JSON.stringify({

                type:
                    "runtime.connected",

                system:
                    "OMNIVEX_OS_PRIME",

                timestamp:
                    Date.now()

            })
        );


        socket.on(
            "close",
            ()=>{

                console.log(
                    "[ATLAS WS DISCONNECTED]"
                );

            }
        );

    }
);


// =====================================
// EVENT BROADCAST
// =====================================

eventBus.on(
    "event",
    (payload)=>{

        const message =
            JSON.stringify(payload);


        wss.clients.forEach(
            (client)=>{

                if(
                    client.readyState === 1
                ){

                    client.send(
                        message
                    );

                }

            }
        );

    }
);


// =====================================
// GRACEFUL SHUTDOWN
// =====================================

process.on(
    "SIGINT",
    ()=>{

        console.log(
            "[OMNIVEX SHUTDOWN SIGINT]"
        );


        try{

            feedManager.stop();

        }
        catch(e){}


        try{

            runtime.stop();

        }
        catch(e){}


        wss.close();


        server.close(
            ()=>{

                process.exit(0);

            }
        );

    }
);


module.exports = server;
