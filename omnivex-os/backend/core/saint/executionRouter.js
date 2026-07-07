/**
 * SAINT EXECUTION ROUTER v1
 * -------------------------
 * PURPOSE:
 * - Route orders intelligently based on liquidity + size
 * - Select execution mode
 * - Prepare orders for execution engine
 */

import {
  getLiquidityScore,
  estimateSlippage,
  getExecutionMode
} from "../liquidity/orderBookModel.js"

import { executeOrder } from "./executionEngine.js"

/* =========================
   ROUTING CORE
========================= */

function selectVenue(symbol, size) {
  // simulated multi-exchange routing layer
  const liquidity = getLiquidityScore(symbol)

  if (liquidity > 0.75) return "COINBASE_LIQ"
  if (liquidity > 0.5) return "BINANCE_SPOT"
  return "DEX_AGGREGATOR"
}

/* =========================
   SIZE ADJUSTMENT
========================= */

function adjustSize(symbol, size) {
  const slippage = estimateSlippage(symbol, size)

  // reduce size if slippage too high
  if (slippage > 0.02) {
    return size * 0.5
  }

  if (slippage > 0.01) {
    return size * 0.75
  }

  return size
}

/* =========================
   EXECUTION WRAPPER
========================= */

export function routeOrder({
  symbol,
  side,
  price,
  size
}) {
  const liquidity = getLiquidityScore(symbol)
  const mode = getExecutionMode(symbol, size)

  const venue = selectVenue(symbol, size)

  const adjustedSize = adjustSize(symbol, size)

  const slippage = estimateSlippage(symbol, adjustedSize)

  const order = {
    symbol,
    side,
    price,
    size: adjustedSize,
    venue,
    mode,
    liquidity,
    expectedSlippage: slippage
  }

  /* =========================
     EXECUTION OUTPUT
  ========================= */

  const result = executeOrder(
    symbol,
    side,
    price,
    adjustedSize
  )

  console.log(
    `[SAINT] ${symbol} ${side} | venue=${venue} mode=${mode} slip=${slippage.toFixed(4)} size=${adjustedSize}`
  )

  return {
    ...order,
    result
  }
}

/* =========================
   DEBUG
========================= */

export function getRoutingInfo(symbol, size) {
  return {
    liquidity: getLiquidityScore(symbol),
    slippage: estimateSlippage(symbol, size),
    mode: getExecutionMode(symbol, size),
    venue: selectVenue(symbol, size)
  }
}
