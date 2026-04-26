# Backend Setup

## Prerequisites

- Python >= 3.12

## Install

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Environment

Create a `.env` file in the repo root (or `backend/`):

```
GOOGLE_API_KEY=<your-gemini-api-key>
```

Optional:

```
EMBED_ENDPOINT=http://localhost:1234/v1/embeddings   # local embedding server
EMBED_MODEL=gemini-embedding-001                      # default
```

## Run

```bash
source .venv/bin/activate
./startup.sh
```

`startup.sh` extracts `../data/archive.tar.xz` into `../data/` if `OUTPUT_DIR` is empty, then launches uvicorn.

Env vars:

| Var | Default | Purpose |
|-----|---------|---------|
| `DATA_ARCHIVE` | `../data/archive.tar.xz` | tarball to extract on first run |
| `DATA_EXTRACT_DIR` | `../data` | extract target |
| `OUTPUT_DIR` | `../data/EnterpriseBench` | ingested-data dir; skip extract if non-empty |
| `HOST` / `PORT` | `0.0.0.0` / `8000` | uvicorn bind |
| `RELOAD` | unset | set `true` for `--reload` |

Or from the repo root:

```bash
./dev.sh   # starts backend :8000 + frontend :8080
```
