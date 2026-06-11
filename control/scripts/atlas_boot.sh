#!/data/data/com.termux/files/usr/bin/bash

echo "=== ATLAS BOOT SEQUENCE INIT ==="

# Kill existing processes (safe reset)
pkill -f "node server.js"
pkill -f "vite"

sleep 1

# START BACKEND
echo "Starting Backend..."
cd ~/SAINT_PRIMAL/backend
nohup node server.js > ../control/logs/backend.log 2>&1 &

sleep 2

# START FRONTEND
echo "Starting Frontend..."
cd ~/SAINT_PRIMAL/frontend
nohup npm run dev > ../control/logs/frontend.log 2>&1 &

sleep 2

echo "=== ATLAS STATUS CHECK ==="

# Backend check
curl -s http://localhost:3000/api/ping

echo ""
echo "Frontend expected: http://localhost:5173"
echo "Backend expected: http://localhost:3000"

echo "=== ATLAS BOOT COMPLETE ==="
