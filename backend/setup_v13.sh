#!/bin/bash

BASE=~/SAINT_PRIMAL/backend

echo "[V13] Creating SAINT canonical structure..."

mkdir -p $BASE/runtime
mkdir -p $BASE/runtime/core
mkdir -p $BASE/runtime/loop

mkdir -p $BASE/core/engine
mkdir -p $BASE/core/orderbook
mkdir -p $BASE/core/execution
mkdir -p $BASE/core/risk
mkdir -p $BASE/core/market

echo "[V13] DONE"
