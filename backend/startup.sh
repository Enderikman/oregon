#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

DATA_ARCHIVE="${DATA_ARCHIVE:-../data/archive.tar.xz}"
OUTPUT_DIR="${OUTPUT_DIR:-output}"
HOST="${HOST:-0.0.0.0}"
PORT="${PORT:-8000}"

if [ -d "$OUTPUT_DIR" ] && [ -n "$(ls -A "$OUTPUT_DIR" 2>/dev/null)" ]; then
  echo "[startup] $OUTPUT_DIR already populated — skipping extract"
elif [ -f "$DATA_ARCHIVE" ]; then
  echo "[startup] Extracting $DATA_ARCHIVE → $OUTPUT_DIR"
  mkdir -p "$OUTPUT_DIR"
  tar -xJf "$DATA_ARCHIVE" --strip-components=1 -C "$OUTPUT_DIR"
  echo "[startup] Extract done"
else
  echo "[startup] No archive at $DATA_ARCHIVE and no $OUTPUT_DIR — server will start empty"
fi

export OUTPUT_DIR

RELOAD_FLAG=""
if [ "${RELOAD:-false}" = "true" ] || [ "${RELOAD:-0}" = "1" ]; then
  RELOAD_FLAG="--reload"
fi

exec python3 -m uvicorn src.server:app --host "$HOST" --port "$PORT" $RELOAD_FLAG
