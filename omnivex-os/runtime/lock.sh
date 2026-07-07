#!/data/data/com.termux/files/usr/bin/bash

LOCK_FILE=~/SAINT_PRIMAL/omnivex-os/runtime/omnivex.lock

case "$1" in
  acquire)
    if [ -f "$LOCK_FILE" ]; then
      echo "❌ OMNIVEX already running"
      exit 1
    fi
    echo $$ > $LOCK_FILE
    ;;

  release)
    rm -f $LOCK_FILE
    ;;

  check)
    [ -f "$LOCK_FILE" ] && echo "LOCKED" || echo "FREE"
    ;;
esac
