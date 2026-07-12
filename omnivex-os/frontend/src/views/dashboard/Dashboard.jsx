import { useEffect, useState } from "react";

import {
  getRuntimeAgents,
  getRuntimeHealth,
  connectRuntimeStream
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


        setRuntime(
          health
        );


        setAgents(
          agentData.agents || {}
        );


      }catch(error){

        console.log(
          "[ATLAS RUNTIME ERROR]",
          error.message
        );

      }

    }


    load();


    const timer =
      setInterval(
        load,
        3000
      );


    return ()=>clearInterval(timer);


  },[]);



  useEffect(()=>{

    const ws =
      connectRuntimeStream({

        onOpen(){

          setWsStatus(
            "CONNECTED"
          );

        },


        onClose(){

          setWsStatus(
            "DISCONNECTED"
          );

        },


        onMessage(event){

          setEvents(
            previous=>[
              event,
              ...previous.slice(0,49)
            ]
          );

        }

      });


    return ()=>ws.close();


  },[]);



  const governance =
    runtime?.chronicle?.data?.governance || {};


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
          GOVERNANCE CONTROL PLANE
        </h2>


        <div className="metric-grid">

          <Card
            title="INTELLIGENCE"
            value={governance.intelligence || "SOPHIA"}
          />


          <Card
            title="AUTHORITY"
            value={governance.authority || "ELOHIM"}
          />


          <Card
            title="RISK"
            value={governance.risk || "AEGIS"}
          />


          <Card
            title="EXECUTION"
            value={governance.execution || "SAINT"}
          />


          <Card
            title="MEMORY"
            value={governance.memory || "CHRONICLE"}
          />


        </div>


      </section>



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
          events.map(
            (event,index)=>(

              <div
                className="event"
                key={index}
              >

                {event.type || "EVENT"}

                <br/>

                {JSON.stringify(event)}

              </div>

            )
          )
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
