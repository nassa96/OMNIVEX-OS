#!/bin/bash

BASE=~/SAINT_PRIMAL/backend

echo "[SAINT] Creating market feed adapters..."

mkdir -p $BASE/core/feeds/binance
mkdir -p $BASE/core/feeds/coinbase
mkdir -p $BASE/core/feeds/unified

echo "[SAINT] Market feed structure ready."
