#!/bin/bash

BASE="$HOME/SAINT_PRIMAL/backend"

echo "[V26 SETUP] Creating execution memory layer..."

mkdir -p $BASE/core/v26
mkdir -p $BASE/core/v26/memory
mkdir -p $BASE/core/v26/metrics
mkdir -p $BASE/runtime/v26

echo "[V26 SETUP] Done."
