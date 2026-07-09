/**
 * OMNIVEX OS PRIME
 *
 * API SERVER
 *
 * Runtime Control Plane
 */


const http = require("http");
const express = require("express");
const cors = require("cors");
const WebSocket = require("ws");


// ===============================
// KERNEL BOOT
// ===============================

const runtime =
require("./kernel/runtime/omnivexRuntime");


const registerAgents =
require("./kernel/registry/registerAgents");


const agentRegistry =
registerAgents();



// ===============================
// SERVER
// ===============================

const app = express();


app.use(
cors()
);


app.use(
express.json()
);



// ===============================
// RUNTIME API
// ===============================


app.get(
"/api/runtime/health",
(req,res)=>{

res.json({

status:
"ONLINE",

system:
"OMNIVEX_OS_PRIME",

heartbeat:
runtime.status().heartbeat,

timestamp:
Date.now()

});

});





app.get(
"/api/runtime/state",
(req,res)=>{

res.json({

system:
"OMNIVEX_OS_PRIME",

runtime:
runtime.status()

});

});





app.get(
"/api/runtime/agents",
(req,res)=>{

res.json(
agentRegistry.health()
);

});




// ===============================
// SYSTEM INFO
// ===============================


app.get(
"/api/system",
(req,res)=>{

res.json({

system:
"OMNIVEX_OS_PRIME",

runtime:
"ACTIVE",

timestamp:
Date.now()

});

});




// ===============================
// HTTP + WEBSOCKET
// ===============================


const server =
http.createServer(app);



const wss =
new WebSocket.Server({
server
});



wss.on(
"connection",
(socket)=>{


socket.send(
JSON.stringify({

type:
"runtime.connected",

state:
runtime.status(),

timestamp:
Date.now()

})
);


});




// ===============================
// START RUNTIME
// ===============================


runtime.start(3000);




// ===============================
// START SERVER
// ===============================


const PORT =
process.env.PORT || 3000;



server.on(
"error",
(err)=>{

if(err.code === "EADDRINUSE"){

console.error(
"[SERVER ERROR] PORT ALREADY IN USE:",
PORT
);

process.exit(1);

}


throw err;

});



server.listen(
PORT,
()=>{

console.log(
"================================="
);

console.log(
" OMNIVEX OS PRIME ONLINE"
);

console.log(
" RUNTIME HEARTBEAT ACTIVE"
);

console.log(
" API PORT:",
PORT
);

console.log(
"================================="
);

}

);




module.exports =
server;
