import React, { useEffect, useState } from 'react'
import { createWS } from '../lib/ws.js'

export default function Dashboard() {
  const [status, setStatus] = useState({})
  const [events, setEvents] = useState([])
  const [control, setControl] = useState({})

  useEffect(() => {
    fetch('http://localhost:3000/api/status')
      .then(r => r.json())
      .then(setStatus)

    const ws = createWS((msg) => {
      setEvents(prev => [...prev, msg])
    })

    return () => ws.close()
  }, [])

  async function send(path) {
    const res = await fetch(`http://localhost:3000${path}`, {
      method: 'POST'
    })
    const data = await res.json()
    setControl(data.controlState)
  }

  return (
    <div className="grid">

      <div className="card">
        <h2>CONTROL PANEL</h2>

        <button onClick={() => send('/api/control/start')}>START</button>
        <button onClick={() => send('/api/control/stop')}>STOP</button>

        <hr />

        <button onClick={() => send('/api/control/risk/LOW')}>LOW</button>
        <button onClick={() => send('/api/control/risk/MED')}>MED</button>
        <button onClick={() => send('/api/control/risk/HIGH')}>HIGH</button>

        <hr />

        <button onClick={() => send('/api/control/size/0.01')}>1%</button>
        <button onClick={() => send('/api/control/size/0.05')}>5%</button>
        <button onClick={() => send('/api/control/size/0.1')}>10%</button>

        <pre>{JSON.stringify(control, null, 2)}</pre>
      </div>

      <div className="card">
        <h2>STATUS</h2>
        <pre>{JSON.stringify(status, null, 2)}</pre>
      </div>

      <div className="card">
        <h2>EVENT FEED</h2>
        <pre style={{ maxHeight: 400, overflow: 'auto' }}>
          {events.slice(-10).map((e, i) => (
            <div key={i}>
              {e.type}
              <br />
              {JSON.stringify(e.data)}
              <hr />
            </div>
          ))}
        </pre>
      </div>

    </div>
  )
}
