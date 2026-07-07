#!/data/data/com.termux/files/usr/bin/bash

SESSION="IMPERIUM"

echo "🧠 Launching IMPERIUM Orchestrator v1..."

# Kill old session if exists
tmux kill-session -t $SESSION 2>/dev/null

# Create new detached session
tmux new-session -d -s $SESSION -n engine

# =========================
# TERMINAL 1 — ENGINE
# =========================
tmux send-keys -t $SESSION:engine "
cd ~/SAINT_PRIMAL &&
echo '⚙️ ENGINE STARTING...' &&
npm run backend
" C-m

# =========================
# TERMINAL 2 — FRONTEND
# =========================
tmux new-window -t $SESSION -n ui

tmux send-keys -t $SESSION:ui "
cd ~/SAINT_PRIMAL/frontend/imperium-ui &&
echo '🖥️ UI STARTING...' &&
npm install >/dev/null 2>&1 &&
npm run dev -- --host
" C-m

# =========================
# MONITOR WINDOW
# =========================
tmux new-window -t $SESSION -n monitor

tmux send-keys -t $SESSION:monitor "
echo '📡 IMPERIUM MONITOR ACTIVE' &&
watch -n 2 'ps aux | grep node'
" C-m

# Attach to session
tmux attach-session -t $SESSION
