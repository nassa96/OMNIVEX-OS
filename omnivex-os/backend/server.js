require("dotenv").config();
const express = require("express");
const cors = require("cors");

const runtime = require("./kernel/runtime/omnivexRuntime");
const feedManager = require("./kernel/feeds/feedManager");
const eventBus = require("./kernel/eventBus");

require("./kernel/runtime/elohimRuntimeBridge");


const app = express();


app.use(cors());
app.use(express.json());



app.get("/health",(req,res)=>{

    res.json({

        system:"OMNIVEX_OS_PRIME",

        status:"ONLINE",

        heartbeat:
            runtime.status().heartbeat || null,

        events:
            eventBus.stats(),

        timestamp:
            Date.now()

    });

});



app.get("/state",(req,res)=>{

    res.json(
        runtime.status()
    );

});



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

            runtime.start();

        }

        catch(err){

            console.error(
                "[BOOT ERROR]",
                err.message
            );

        }


    }
);



process.on(
    "SIGINT",
    ()=>{


        console.log(
            "[OMNIVEX SHUTDOWN]"
        );


        try{

            feedManager.stop();

            runtime.stop();

        }
        catch(err){}



        server.close(
            ()=>process.exit(0)
        );


    }
);

