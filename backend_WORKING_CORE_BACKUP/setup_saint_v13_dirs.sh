#!/bin/bash

BASE="$HOME/SAINT_PRIMAL/backend"

echo "[SAINT V13] Creating unified runtime structure..."

mkdir -p $BASE/runtime/core
mkdir -p $BASE/runtime/engine
mkdir -p $BASE/runtime/loops
mkdir -p $BASE/runtime/streams
mkdir -p $BASE/runtime/execution
mkdir -p $BASE/runtime/orderbook
mkdir -p $BASE/runtime/risk
mkdir -p $BASE/runtime/learning
mkdir -p $BASE/runtime/state

mkdir -p $BASE/logs
mkdir -p $BASE/data

echo "[SAINT V13] Directory structure ready."
