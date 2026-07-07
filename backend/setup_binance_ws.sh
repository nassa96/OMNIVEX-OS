#!/bin/bash

BASE="$HOME/SAINT_PRIMAL/backend"

echo "[BINANCE WS] Creating market feed layer..."

mkdir -p $BASE/core/market/ws
mkdir -p $BASE/core/market/adapters

echo "[BINANCE WS] Done."
