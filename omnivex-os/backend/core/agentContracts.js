export const SOPHIA_SCHEMA = {
  symbol: "string",
  signal: "LONG | SHORT | HOLD",
  confidence: "number (0-1)",
  rsi: "number",
  reason: "string"
}

export const AEGIS_SCHEMA = {
  approved: "boolean",
  risk_score: "number (0-100)",
  position_size_pct: "number (0-1)",
  reason: "string"
}

export const MERCURY_SCHEMA = {
  trend: "UP | DOWN | SIDEWAYS",
  volatility: "LOW | MED | HIGH",
  regime: "RISK_ON | RISK_OFF"
}

export const SAINT_SCHEMA = {
  action: "OPEN | CLOSE | HOLD",
  order_type: "PAPER",
  size_usd: "number",
  entry_price: "number"
}

export const FINAL_DECISION_SCHEMA = {
  symbol: "string",
  final_decision: "OPEN | REJECT",
  confidence: "number",
  risk_approval: "boolean",
  size: "number",
  reason_chain: "array"
}
