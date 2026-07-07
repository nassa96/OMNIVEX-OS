"use strict";

const crypto = require("crypto");

const BASE_STRATEGY = {
  weights: {
    opportunity: 0.4,
    momentum: 0.3,
    risk: 0.2,
    regime: 0.1
  },
  thresholds: {
    buy: 0.7,
    sell: 0.3
  }
};

function mutate(val, strength = 0.1) {
  return Math.max(0, Math.min(1, val + (Math.random() - 0.5) * strength));
}

function mutateStrategy(base = BASE_STRATEGY) {
  return {
    id: crypto.randomBytes(4).toString("hex"),
    weights: {
      opportunity: mutate(base.weights.opportunity),
      momentum: mutate(base.weights.momentum),
      risk: mutate(base.weights.risk),
      regime: mutate(base.weights.regime)
    },
    thresholds: {
      buy: mutate(base.thresholds.buy),
      sell: mutate(base.thresholds.sell)
    },
    parent: "BASE"
  };
}

function generatePopulation(n = 5) {
  return Array.from({ length: n }, mutateStrategy);
}

module.exports = {
  mutateStrategy,
  generatePopulation,
  BASE_STRATEGY
};
