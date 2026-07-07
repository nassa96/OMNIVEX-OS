#!/data/data/com.termux/files/usr/bin/bash

ROOT="$HOME/SAINT_PRIMAL"

BACKEND="$ROOT/backend"
FRONTEND="$ROOT/frontend/app"
LOGS="$ROOT/logs"

mkdir -p "$LOGS"

echo "======================================"
echo " OMNIVEX CONTROL PLANE V2"
echo "======================================"

start_backend() {
    echo "[CONTROL] Starting Backend..."
    cd "$BACKEND" || exit 1
    node server.cjs >> "$LOGS/backend.log" 2>&1 &
    BACKEND_PID=$!
    echo "$BACKEND_PID" > "$LOGS/backend.pid"
}

start_frontend() {
    echo "[CONTROL] Starting Frontend..."
    cd "$FRONTEND" || exit 1
    npm run dev -- --host >> "$LOGS/frontend.log" 2>&1 &
    FRONTEND_PID=$!
    echo "$FRONTEND_PID" > "$LOGS/frontend.pid"
}

health() {
    curl -s http://localhost:3000/api/brain >/dev/null
    if [ $? -eq 0 ]; then
        echo "[OK] Backend Healthy"
    else
        echo "[FAIL] Backend Offline"
    fi
}

start_backend
sleep 2

start_frontend
sleep 3

health

echo
echo "Backend  PID : $BACKEND_PID"
echo "Frontend PID : $FRONTEND_PID"
echo
echo "Supervisor Active..."
echo

while true
do

if ! kill -0 "$BACKEND_PID" 2>/dev/null
then
    echo "[SUPERVISOR] Backend crashed..."
    start_backend
fi

if ! kill -0 "$FRONTEND_PID" 2>/dev/null
then
    echo "[SUPERVISOR] Frontend crashed..."
    start_frontend
fi

sleep 5

done
