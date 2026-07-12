require("dotenv").config();

const express = require("express");
const cors = require("cors");

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


app.get(
    "/health",
    (req, res) => {

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


app.get(
    "/state",
    (req, res) => {

        res.json(
            runtime.status()
        );

    }
);


const PORT =
    process.env.PORT || 3000;


const server =
    app.listen(
        PORT,
        () => {

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


            try {

                feedManager.start();

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


function shutdown(signal){

    console.log(
        `[OMNIVEX SHUTDOWN ${signal}]`
    );


    try {

        feedManager.stop();

        runtime.stop();

    }
    catch(error){

        console.error(
            "[SHUTDOWN ERROR]",
            error.message
        );

    }


    server.close(
        () => process.exit(0)
    );

}


process.on(
    "SIGINT",
    () => shutdown("SIGINT")
);


process.on(
    "SIGTERM",
    () => shutdown("SIGTERM")
);
