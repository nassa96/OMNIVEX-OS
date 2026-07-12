import { useEffect, useState } from "react";
import {
  getRuntimeAgents,
  getRuntimeHealth
} from "../../lib/runtimeClient";


export default function Dashboard(){

  const [runtime,setRuntime] = useState(null);
  const [agents,setAgents] = useState({});
  const [wsStatus,setWsStatus] = useState("OFFLINE");
  const [events,setEvents] = useState([]);


  useEffect(()=>{

    async function load(){

      try{

        const health =
          await getRuntimeHealth();

        const agentData =
          await getRuntimeAgents();


        setRuntime(health);

        setAgents(
          agentData.agents || {}
        );


      }catch(err){

        console.log(
          "[ATLAS RUNTIME ERROR]",
          err.message
        );

      }

    }


    load();

    const timer =
      setInterval(load,3000);


    return ()=>clearInterval(timer);


  },[]);



  useEffect(()=>{

    const ws =
      new WebSocket(
        "ws://localhost:3000"
      );


    ws.onopen = ()=>{
      setWsStatus("CONNECTED");
    };


    ws.onclose = ()=>{
      setWsStatus("DISCONNECTED");
    };


    ws.onmessage = (msg)=>{

      try{

        const event =
          JSON.parse(msg.data);


        setEvents(prev=>[
          event,
          ...prev.slice(0,49)
        ]);


      }catch{}

    };


    return ()=>ws.close();


  },[]);



return (

<div className="dashboard">


<section className="hero-panel">

<h1>
ATLAS TERMINAL
</h1>

<p>
VEYRONIX AUTONOMOUS INTELLIGENCE COMMAND CENTER
</p>

<div>
OMNIVEX OS PRIME • {wsStatus}
</div>

</section>



<div className="metric-grid">


<Card
title="SYSTEM"
value={runtime?.system || "BOOTING"}
/>


<Card
title="STATUS"
value={runtime?.status || "--"}
/>


<Card
title="HEARTBEAT"
value={runtime?.heartbeat || 0}
/>


<Card
title="EVENTS"
value={runtime?.events?.events || 0}
/>


</div>



<section className="panel">

<h2>
PRIME-16 AGENT NETWORK
</h2>


<div className="metric-grid">


{
Object.entries(agents).map(
([name,data])=>(

<Card
key={name}
title={name}
value={data.status}
/>

))
}


</div>

</section>



<section className="panel">

<h2>
LIVE INTELLIGENCE STREAM
</h2>


<div className="event-stream">

{
events.map(
(event,i)=>(

<div
className="event"
key={i}
>

{event.type || "EVENT"}

<br/>

{JSON.stringify(event)}

</div>

))
}

</div>


</section>


</div>

);


}



function Card({title,value}){

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
