#!/data/data/com.termux/files/usr/bin/bash

echo "=== ATLAS STATUS ==="

echo ""
echo "Backend Health:"
curl -s http://localhost:3000/api/ping || echo "Backend DOWN"

echo ""
echo "Frontend Check:"
curl -s http://localhost:5173 | head -n 5

echo ""
echo "Process Check:"
ps -A | grep node | head -n 5
