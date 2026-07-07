export function buildFinalDecision({ sophia, aegis, mercury }) {
  const reason_chain = []

  reason_chain.push(`SOPHIA:${sophia.signal} conf=${sophia.confidence}`)
  reason_chain.push(`AEGIS:${aegis.approved} risk=${aegis.risk_score}`)
  reason_chain.push(`MERCURY:${mercury.trend}/${mercury.regime}`)

  const allowed =
    aegis.approved === true &&
    sophia.confidence >= 0.6

  return {
    symbol: sophia.symbol,
    final_decision: allowed ? "OPEN" : "REJECT",
    confidence: sophia.confidence,
    risk_approval: aegis.approved,
    size: aegis.position_size_pct,
    reason_chain
  }
}
