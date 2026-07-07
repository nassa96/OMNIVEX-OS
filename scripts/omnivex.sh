#!/data/data/com.termux/files/usr/bin/bash

# =========================================================
# OMNIVEX CONTROL PLANE V2 (LOCKED BOOT SYSTEM)
# =========================================================

ROOT="$HOME/SAINT_PRIMAL"

cd "$ROOT" || {
  echo "[FATAL] Root directory missing"
  exit 1
}

echo "======================================"
echo " OMNIVEX CONTROL PLANE V2"
echo "======================================"

# ---------------------------------------------------------
# SINGLE INSTANCE GUARD
# ---------------------------------------------------------

if pgrep -f "backend/server.cjs" > /dev/null; then
  echo "[LOCK] Backend already running. Killing stale process..."
  pkill -f "backend/server.cjs"
fi

if pgrep -f "vite" > /dev/null; then
  echo "[LOCK] Frontend already running. Killing stale process..."
  pkill -f "vite"
fi

# ---------------------------------------------------------
# START BACKEND
# ---------------------------------------------------------

echo "[1/3] Starting Backend Kernel..."

node backend/server.cjs &
BACKEND_PID=$!

sleep 2

# health check
if curl -s http://localhost:3000/api/health > /dev/null; then
  echo "Backend: OK"
else
  echo "[WARN] Backend health check failed (booting anyway)"
fi

# ---------------------------------------------------------
# START FRONTEND
# ---------------------------------------------------------

echo "[2/3] Starting Frontend UI..."

cd frontend/app || {
  echo "[FATAL] Frontend directory missing"
  exit 1
}

npm run dev -- --host 0.0.0.0 &
FRONTEND_PID=$!

cd "$ROOT"

# ---------------------------------------------------------
# SYSTEM STATUS
# ---------------------------------------------------------

sleep 2

echo "[3/3] System Verification..."

echo "======================================"
echo " OMNIVEX SYSTEM ONLINE (CONTROLLED)"
echo "======================================"
echo " Backend:   http://localhost:3000"
echo " Frontend:  http://localhost:5173"
echo "======================================"
echo " Backend PID:  $BACKEND_PID"
echo " Frontend PID: $FRONTEND_PID"
echo "======================================"

# ---------------------------------------------------------
# WATCHDOG LOOP (FAILSAFE)
# ---------------------------------------------------------

while true; do

  sleep 10

  if ! pgrep -f "backend/server.cjs" > /dev/null; then
    echo "[RESTART] Backend died. Restarting..."
    node backend/server.cjs &
  fi

  if ! pgrep -f "vite" > /dev/null; then
    echo "[RESTART] Frontend died. Restarting..."
    cd frontend/app && npm run dev -- --host 0.0.0.0 &
    cd "$ROOT"
  fi

done

