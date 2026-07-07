#!/bin/bash

BASE="$(pwd)"

echo "[SAINT SETUP] Creating canonical SAINT structure at $BASE"

mkdir -p $BASE/runtime
mkdir -p $BASE/runtime/engine
mkdir -p $BASE/runtime/execution
mkdir -p $BASE/runtime/orderbook
mkdir -p $BASE/runtime/learning
mkdir -p $BASE/runtime/market
mkdir -p $BASE/runtime/risk
mkdir -p $BASE/runtime/utils

mkdir -p $BASE/core/feeds
mkdir -p $BASE/core/market/orderbook
mkdir -p $BASE/core/execution
mkdir -p $BASE/core/risk
mkdir -p $BASE/core/chronicle
mkdir -p $BASE/core/registry

mkdir -p $BASE/state
mkdir -p $BASE/logs
mkdir -p $BASE/data

echo "[SAINT SETUP] DONE"
