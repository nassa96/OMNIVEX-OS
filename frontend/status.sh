echo "=== ATLAS STATUS ==="

echo ""
echo "Backend:"
curl -s http://localhost:4000/api/ping

echo ""
echo "Frontend (HTML check):"
curl -s http://localhost:5173 | head -n 3

echo ""
echo "WebSocket sanity:"
echo "Check UI console for WS CONNECTED + market_tick"
