#!/usr/bin/env bash
set -e

trap 'kill 0' EXIT

cd "$(dirname "$0")"

echo "Starting backend..."
(cd backend && python3 -m uvicorn src.server:app --host 0.0.0.0 --port 8000 --reload) &

echo "Starting frontend..."
(cd frontend && bun run dev) &

wait
