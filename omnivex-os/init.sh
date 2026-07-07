#!/usr/bin/env bash

# ==========================================
# OMNIVEX GO MODULE INIT
# ==========================================

set -e

echo "Initializing Go module..."

go mod init omnivex-os || true
go mod tidy

echo "✅ Go module ready"

