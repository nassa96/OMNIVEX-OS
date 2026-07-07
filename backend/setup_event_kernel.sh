#!/bin/bash

BASE=~/SAINT_PRIMAL/backend

echo "[SAINT] Creating Event-Driven Kernel..."

mkdir -p $BASE/core/kernel/events
mkdir -p $BASE/core/kernel/bus
mkdir -p $BASE/core/kernel/handlers
mkdir -p $BASE/core/kernel/plugins

echo "[SAINT] Kernel structure ready."
