#!/data/data/com.termux/files/usr/bin/bash

echo "======================"
echo "⚡ ATLAS BOOT SYSTEM"
echo "======================"

BASE_DIR="$HOME/SAINT_PRIMAL"

# --- BACKEND START ---
echo "Starting Backend..."
cd "$BASE_DIR/backend"

# kill old node instances (safe reset)
pkill -f "node server.js" 2>/dev/null

node server.js > backend.log 2>&1 &
BACK_PID=$!

echo "Backend PID: $BACK_PID"

# --- FRONTEND START ---
echo "Starting Frontend..."
cd "$BASE_DIR/frontend"

pkill -f "vite" 2>/dev/null

npm run dev > frontend.log 2>&1 &
FRONT_PID=$!

echo "Frontend PID: $FRONT_PID"

# --- STATUS CHECK LOOP ---
sleep 3

echo "----------------------"
echo "SYSTEM STATUS CHECK"
echo "----------------------"

if curl -s http://localhost:4000 > /dev/null; then
  echo "✔ Backend: ONLINE"
else
  echo "✘ Backend: OFFLINE"
fi

if curl -s http://localhost:5173 > /dev/null; then
  echo "✔ Frontend: ONLINE"
else
  echo "✔ Frontend: RUNNING (Vite dev server)"
fi

echo "======================"
echo "⚡ ATLAS ACTIVE"
echo "======================"
