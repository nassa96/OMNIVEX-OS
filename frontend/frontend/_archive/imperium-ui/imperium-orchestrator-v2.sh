#!/data/data/com.termux/files/usr/bin/bash

SESSION="IMPERIUM"

echo "🔒 IMPERIUM ORCHESTRATOR v2 STARTING..."

# -------------------------
# CLEAN OLD PROCESSES
# -------------------------
pkill -f vite 2>/dev/null
pkill -f "node server.js" 2>/dev/null
pkill -f "npm run dev" 2>/dev/null

sleep 2

# -------------------------
# START TMUX SESSION
# -------------------------
tmux kill-session -t $SESSION 2>/dev/null
tmux new-session -d -s $SESSION -n engine

# ENGINE (TERMINAL 1)
tmux send-keys -t $SESSION:engine "
cd ~/SAINT_PRIMAL &&
echo '⚙️ ENGINE ONLINE' &&
node server.js
" C-m

# UI (TERMINAL 2)
tmux new-window -t $SESSION -n ui

tmux send-keys -t $SESSION:ui "
cd ~/SAINT_PRIMAL/frontend/imperium-ui &&
echo '🖥️ UI ONLINE' &&
npm run dev -- --host
" C-m

# MONITOR (TERMINAL 3)
tmux new-window -t $SESSION -n monitor

tmux send-keys -t $SESSION:monitor "
watch -n 2 'ps aux | grep node | grep -v grep'
" C-m

# -------------------------
# CRITICAL FIX: MUST ATTACH SESSION
# -------------------------
tmux attach-session -t $SESSION
