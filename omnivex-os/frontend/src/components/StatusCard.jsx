import React from 'react'

export default function StatusCard({ status }) {
  return (
    <div className="card">
      <h2>System Status</h2>
      <p><b>Symbol:</b> {status.symbol}</p>
      <p><b>Price:</b> {status.price}</p>
      <p><b>Capital:</b> ${status.capital}</p>
      <p><b>Last Trade:</b> {status.lastTrade ? 'ACTIVE' : 'NONE'}</p>
    </div>
  )
}
