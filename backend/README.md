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
python -m uvicorn src.server:app --host 0.0.0.0 --port 8000 --reload
```

Or from the repo root:

```bash
./dev.sh   # starts backend :8000 + frontend :8080
```
