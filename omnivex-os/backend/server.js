const express = require("express");
const cors = require("cors");
const http = require("http");

const runtime =
require("./kernel/runtime/omnivexRuntime");

const feedManager =
require("./kernel/feeds/feedManager");

const stateStore =
require("./kernel/state/stateStore");


const app = express();

app.use(cors());
app.use(express.json());


app.get("/health",(req,res)=>{

    res.json({

        system:"OMNIVEX_OS_PRIME",
        status:"ONLINE"

    });

});


app.get("/api/runtime/state",(req,res)=>{

    res.json({

        system:"OMNIVEX_OS_PRIME",
        runtime:stateStore.get()

    });

});


const server =
http.createServer(app);


const PORT =
process.env.PORT || 3000;


server.listen(PORT,()=>{


console.log(`
=================================
VEYRONIX INTELLIGENCE ENGINE
OMNIVEX OS PRIME CORE ONLINE
RUNTIME HEARTBEAT ACTIVE
API PORT: ${PORT}
=================================
`);


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


});


process.on("SIGINT",()=>{


console.log(
"[OMNIVEX SHUTDOWN]"
);


try{

feedManager.stop();

runtime.stop();

}
catch(err){}


process.exit(0);


});
