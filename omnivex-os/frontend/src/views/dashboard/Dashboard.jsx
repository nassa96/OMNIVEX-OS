import { useEffect, useState } from "react";

export default function Dashboard(){

  const [runtime,setRuntime] = useState(null);
  const [wsStatus,setWsStatus] = useState("OFFLINE");
  const [events,setEvents] = useState([]);


  useEffect(()=>{

    async function load(){

      try{

        const data =
          await fetch(
            "http://localhost:3000/api/runtime/state"
          )
          .then(r=>r.json());


        setRuntime(data.runtime);

      }catch(err){

        console.log(err);

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



  const agents =
    runtime?.agents || {};



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
          title="HEARTBEAT"
          value={runtime?.heartbeat || 0}
        />


        <Card
          title="MARKET"
          value={runtime?.market?.symbol || "--"}
        />


        <Card
          title="PRICE"
          value={
            "$"+(runtime?.market?.price || 0)
          }
        />


        <Card
          title="TREND"
          value={runtime?.market?.trend || "--"}
        />


        <Card
          title="DECISION"
          value={runtime?.decision?.action || "--"}
        />


      </div>



      <section className="panel">

        <h2>
          AGENT NETWORK
        </h2>


        <div className="metric-grid">

          {
            Object.entries(agents)
            .map(([name,data])=>(

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
            events.map((event,i)=>(

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
