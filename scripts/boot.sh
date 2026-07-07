#!/bin/bash

echo "======================================"
echo " OMNIVEX AUTONOMOUS BOOT SEQUENCE"
echo "======================================"

BASE_DIR="$HOME/SAINT_PRIMAL"

# -------------------------
# START BACKEND
# -------------------------
echo "[1/2] Starting Backend Kernel..."
cd "$BASE_DIR/backend"

# kill old process if exists
pkill -f server.cjs 2>/dev/null

node server.cjs &
BACKEND_PID=$!

echo "Backend PID: $BACKEND_PID"

# -------------------------
# START FRONTEND
# -------------------------
echo "[2/2] Starting Frontend UI..."
cd "$BASE_DIR/frontend/app"

npm run dev -- --host &
FRONTEND_PID=$!

echo "Frontend PID: $FRONTEND_PID"

# -------------------------
# BOOT COMPLETE
# -------------------------
echo "======================================"
echo " OMNIVEX SYSTEM ONLINE"
echo " Backend:  http://localhost:3000"
echo " Frontend: http://localhost:5173"
echo "======================================"

# keep script alive
wait
