export function shouldClosePosition(position, price) {
  const pnlPct = (price - position.entry_price) / position.entry_price

  const TAKE_PROFIT = 0.02
  const STOP_LOSS = -0.01

  if (pnlPct >= TAKE_PROFIT) {
    return { close: true, reason: "TAKE_PROFIT" }
  }

  if (pnlPct <= STOP_LOSS) {
    return { close: true, reason: "STOP_LOSS" }
  }

  return { close: false }
}
