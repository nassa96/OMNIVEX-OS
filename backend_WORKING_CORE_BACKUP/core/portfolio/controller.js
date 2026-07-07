"use strict";

const STATE = {
  equity: 1000,
  exposure: 0,
  pnl: 0
};

export function canTrade() {
  return { approved: true };
}

export function update(execution) {
  STATE.pnl += execution?.raw?.pnl || 0;
  STATE.equity += STATE.pnl;
}

export function getState() {
  return STATE;
}

export default { canTrade, update, getState };
