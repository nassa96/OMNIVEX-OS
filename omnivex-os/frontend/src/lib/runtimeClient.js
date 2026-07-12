const API_URL = "http://localhost:3000";
const WS_URL = "ws://localhost:3000";


async function request(path) {

  const response =
    await fetch(
      `${API_URL}${path}`
    );


  if (!response.ok) {

    throw new Error(
      `Runtime API error: ${response.status}`
    );

  }


  return response.json();

}


export function getRuntimeAgents(){

  return request(
    "/api/runtime/agents"
  );

}


export function getRuntimeHealth(){

  return request(
    "/health"
  );

}


export function getRuntimeState(){

  return request(
    "/api/runtime/state"
  );

}


export function connectRuntimeStream(
  handlers = {}
){

  const ws =
    new WebSocket(
      WS_URL
    );


  ws.onopen = ()=>{

    handlers.onOpen?.();

  };


  ws.onclose = ()=>{

    handlers.onClose?.();

  };


  ws.onmessage = (message)=>{

    try {

      const event =
        JSON.parse(
          message.data
        );

      handlers.onMessage?.(
        event
      );


    } catch(error){

      console.log(
        "[RUNTIME STREAM ERROR]",
        error.message
      );

    }

  };


  return ws;

}
