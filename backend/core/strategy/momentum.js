"use strict";

export async function momentumStrategy({ market }) {
  const price = market.price;

  // simplified placeholder logic
  const trend = price % 2 === 0 ? "UP" : "DOWN";

  return {
    action: trend === "UP" ? "BUY" : "SELL",
    confidence: 0.55,
    weight: 1
  };
}

export default momentumStrategy;
