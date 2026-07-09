import { useEffect, useState } from "react";

export default function Dashboard(){

const [health,setHealth]=useState(null);
const [runtime,setRuntime]=useState(null);
const [agents,setAgents]=useState({});
const [events,setEvents]=useState([]);
const [wsStatus,setWsStatus]=useState("OFFLINE");


useEffect(()=>{

async function load(){

try{

const h =
await fetch("http://localhost:3000/health")
.then(r=>r.json());

setHealth(h);


const state =
await fetch("http://localhost:3000/api/runtime/state")
.then(r=>r.json());

setRuntime(state);


const agentData =
await fetch("http://localhost:3000/api/runtime/agents")
.then(r=>r.json());

setAgents(agentData);


}catch(err){

console.log(err);

}

}


load();

const timer=setInterval(load,3000);


return()=>clearInterval(timer);


},[]);



useEffect(()=>{


const ws =
new WebSocket("ws://localhost:3000");


ws.onopen=()=>{

setWsStatus("CONNECTED");

};


ws.onclose=()=>{

setWsStatus("DISCONNECTED");

};



ws.onmessage=(msg)=>{

try{

const data=JSON.parse(msg.data);


setEvents(prev=>[
data,
...prev.slice(0,49)
]);


}catch{}

};


return()=>ws.close();


},[]);



return (

<div className="dashboard">


<section className="hero-panel">

<h1>
VEYRONIX COMMAND CENTER
</h1>

<p>
Autonomous Intelligence Infrastructure
</p>

<div>
POWERED BY OMNIVEX OS PRIME ENGINE
</div>


</section>



<div className="metric-grid">


<MetricCard
title="SYSTEM"
value={
health?.system ||
"BOOTING"
}
/>


<MetricCard
title="RUNTIME"
value={
runtime?.runtime?.status ||
"ONLINE"
}
/>


<MetricCard
title="WEBSOCKET"
value={wsStatus}
/>


<MetricCard
title="AGENTS"
value={
Object.keys(agents).length +
" ONLINE"
}
/>


</div>



<section className="panel">

<h2>
AGENT NETWORK
</h2>


<div className="metric-grid">


{
Object.entries(agents).map(
([name,data])=>(

<MetricCard
key={name}
title={name}
value={
data.status ||
"UNKNOWN"
}
/>

)

)

}


</div>


</section>




<section className="panel">

<h2>
LIVE INTELLIGENCE STREAM
</h2>


<div className="event-stream">


{
events.length===0 ?

<div>
Waiting for kernel events...
</div>

:

events.map((event,i)=>(

<div className="event" key={i}>

{event.type || "EVENT"}

<span>

{JSON.stringify(
event.payload || event
)}

</span>

</div>

))

}


</div>


</section>



<section className="panel">

<h2>
KERNEL STATE
</h2>


<pre>

{
JSON.stringify(
runtime,
null,
2
)
}

</pre>


</section>



</div>

);


}




function MetricCard({title,value}){


return (

<div className="metric-card">

<div className="metric-title">

{title}

</div>


<div className="metric-value">

{value}

</div>


</div>

);


}
