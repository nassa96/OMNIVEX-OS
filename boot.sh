#!/data/data/com.termux/files/usr/bin/bash

echo "=============================="
echo " OMNIVEX ONE-CLICK BOOT"
echo "=============================="

ROOT="$PWD"

# ------------------------------
# START BACKEND
# ------------------------------
echo "[1/2] Starting backend..."

cd "$ROOT/backend"

if [ ! -f server.cjs ]; then
  echo "ERROR: backend/server.cjs missing"
  exit 1
fi

node server.cjs > backend.log 2>&1 &
BACKEND_PID=$!

echo "Backend PID: $BACKEND_PID"

sleep 2

# ------------------------------
# START FRONTEND
# ------------------------------
echo "[2/2] Starting frontend..."

cd "$ROOT/frontend/app"

if [ ! -d node_modules ]; then
  echo "Installing frontend dependencies..."
  npm install
fi

npm run dev -- --host > frontend.log 2>&1 &
FRONTEND_PID=$!

echo "Frontend PID: $FRONTEND_PID"

echo "=============================="
echo " OMNIVEX SYSTEM ONLINE"
echo "=============================="
echo "Backend:  http://localhost:3000"
echo "Frontend: http://localhost:5173"
echo "=============================="

echo $BACKEND_PID > "$ROOT/backend.pid"
echo $FRONTEND_PID > "$ROOT/frontend.pid"

wait
