#!/usr/bin/env bash
set -e

trap 'kill 0' EXIT

cd "$(dirname "$0")"

echo "Starting backend..."
(cd backend && .venv/bin/python -m uvicorn src.server:app --host 0.0.0.0 --port 8000 --reload) &

echo "Starting voice-agent (Gradium bridge)..."
(cd backend && python3 -m uvicorn src.voice_agent.main:app --host 0.0.0.0 --port 8001 --reload) &

echo "Starting frontend..."
(cd frontend && bun run dev) &

wait
