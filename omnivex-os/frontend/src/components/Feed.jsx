import React from 'react'

export default function Feed({ events }) {
  return (
    <div className="card">
      <h2>Live Event Feed</h2>
      <div className="feed">
        {events.slice(-10).reverse().map((e, i) => (
          <div key={i} className="event">
            <b>{e.type}</b>
            <pre>{JSON.stringify(e.data, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  )
}
