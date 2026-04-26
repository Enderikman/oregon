"""Voice-agent bridge — wraps Gradium TTS/STT in the simple protocol that
`frontend/src/lib/speech.ts` expects.

Run:
    uvicorn src.voice_agent.main:app --host 0.0.0.0 --port 8001

Env:
    GRADIUM_API_KEY   required
    GRADIUM_VOICE_ID  optional, default voice for TTS
    GRADIUM_MODEL     optional, default "default"
    GRADIUM_BASE_HTTP optional, default https://api.gradium.ai
    GRADIUM_BASE_WS   optional, default wss://api.gradium.ai
"""

from __future__ import annotations

import asyncio
import json
import logging
import os
import time
from typing import Optional

import httpx
import websockets
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel

logger = logging.getLogger("voice-agent")
logging.basicConfig(level=logging.INFO)

GRADIUM_API_KEY = os.environ.get("GRADIUM_API_KEY", "")
GRADIUM_BASE_HTTP = os.environ.get("GRADIUM_BASE_HTTP", "https://api.gradium.ai").rstrip("/")
GRADIUM_BASE_WS = os.environ.get("GRADIUM_BASE_WS", "wss://api.gradium.ai").rstrip("/")
DEFAULT_VOICE_ID = os.environ.get("GRADIUM_VOICE_ID", "YTpq7expH9539ERJ")
DEFAULT_MODEL = os.environ.get("GRADIUM_MODEL", "default")

# Gradium STT step is 80 ms at 24 kHz mono 16-bit = 1920 samples = 3840 bytes.
# The frontend worklet posts 40 ms frames; we buffer two before forwarding.
PCM_FRAME_BYTES = 1920 * 2

app = FastAPI(title="Oregon Voice Agent (Gradium bridge)")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------

@app.get("/api/health")
def health() -> dict:
    return {
        "ok": True,
        "configured": bool(GRADIUM_API_KEY),
        "voice_id": DEFAULT_VOICE_ID,
        "model": DEFAULT_MODEL,
    }


# ---------------------------------------------------------------------------
# TTS
# ---------------------------------------------------------------------------

class TtsRequest(BaseModel):
    text: str
    language: Optional[str] = None
    voice_id: Optional[str] = None


@app.post("/api/tts")
async def tts(req: TtsRequest) -> Response:
    if not GRADIUM_API_KEY:
        raise HTTPException(500, "GRADIUM_API_KEY is not configured on the voice-agent server")
    text = (req.text or "").strip()
    if not text:
        raise HTTPException(400, "text must be non-empty")

    payload = {
        "text": text,
        "voice_id": req.voice_id or DEFAULT_VOICE_ID,
        "output_format": "wav",
        "model_name": DEFAULT_MODEL,
        "only_audio": True,
    }
    async with httpx.AsyncClient(timeout=60) as client:
        r = await client.post(
            f"{GRADIUM_BASE_HTTP}/api/post/speech/tts",
            json=payload,
            headers={"x-api-key": GRADIUM_API_KEY, "Content-Type": "application/json"},
        )
    if r.status_code != 200:
        raise HTTPException(r.status_code, f"Gradium TTS error: {r.text[:500]}")
    return Response(content=r.content, media_type="audio/wav")


# ---------------------------------------------------------------------------
# STT — WebSocket bridge
# ---------------------------------------------------------------------------

@app.websocket("/api/stt")
async def stt(ws: WebSocket) -> None:
    await ws.accept()

    if not GRADIUM_API_KEY:
        await _safe_send_json(ws, {"type": "error", "message": "GRADIUM_API_KEY not configured"})
        await ws.close()
        return

    silence_threshold_s = await _await_setup(ws)
    if silence_threshold_s is None:
        return

    try:
        gradium_ws = await websockets.connect(
            f"{GRADIUM_BASE_WS}/api/speech/asr",
            additional_headers={"x-api-key": GRADIUM_API_KEY},
            max_size=None,
        )
    except Exception as exc:  # noqa: BLE001
        logger.exception("gradium connect failed")
        await _safe_send_json(ws, {"type": "error", "message": f"upstream connect failed: {exc}"})
        await ws.close()
        return

    try:
        await gradium_ws.send(json.dumps({
            "type": "setup",
            "model_name": DEFAULT_MODEL,
            "input_format": "pcm",
        }))
        await _run_session(ws, gradium_ws, silence_threshold_s)
    finally:
        try:
            await gradium_ws.close()
        except Exception:
            pass
        try:
            await ws.close()
        except Exception:
            pass


async def _await_setup(ws: WebSocket) -> Optional[float]:
    """Read the first frame, validate it as a setup message, return the
    silence threshold (seconds). Returns None on protocol error (after
    sending an error frame and closing)."""
    try:
        first = await ws.receive()
    except WebSocketDisconnect:
        return None
    if first.get("type") != "websocket.receive":
        await ws.close()
        return None
    text = first.get("text")
    if text is None:
        await _safe_send_json(ws, {"type": "error", "message": "expected setup text frame"})
        await ws.close()
        return None
    try:
        setup = json.loads(text)
    except json.JSONDecodeError:
        await _safe_send_json(ws, {"type": "error", "message": "setup must be JSON"})
        await ws.close()
        return None
    if setup.get("type") != "setup":
        await _safe_send_json(ws, {"type": "error", "message": "first message must be type=setup"})
        await ws.close()
        return None
    try:
        return float(setup.get("silence_threshold_s", 2.5))
    except (TypeError, ValueError):
        return 2.5


async def _run_session(
    ws: WebSocket,
    gradium_ws: websockets.WebSocketClientProtocol,
    silence_threshold_s: float,
) -> None:
    state = {
        "buffer": "",
        "last_text_at": time.monotonic(),
        "final_sent": False,
        "client_ended": False,
    }
    pcm_buf = bytearray()

    async def emit_final() -> None:
        if state["final_sent"]:
            return
        state["final_sent"] = True
        await _safe_send_json(ws, {
            "type": "transcript",
            "text": state["buffer"].strip(),
            "final": True,
        })

    async def from_client() -> None:
        try:
            while True:
                msg = await ws.receive()
                if msg.get("type") == "websocket.disconnect":
                    return
                if (b := msg.get("bytes")) is not None:
                    pcm_buf.extend(b)
                    while len(pcm_buf) >= PCM_FRAME_BYTES:
                        chunk = bytes(pcm_buf[:PCM_FRAME_BYTES])
                        del pcm_buf[:PCM_FRAME_BYTES]
                        try:
                            await gradium_ws.send(chunk)
                        except websockets.ConnectionClosed:
                            return
                elif (t := msg.get("text")) is not None:
                    try:
                        payload = json.loads(t)
                    except json.JSONDecodeError:
                        continue
                    if payload.get("type") == "end":
                        state["client_ended"] = True
                        # Flush any remaining sub-frame bytes (Gradium tolerates a partial tail).
                        if pcm_buf:
                            try:
                                await gradium_ws.send(bytes(pcm_buf))
                            except websockets.ConnectionClosed:
                                pass
                            pcm_buf.clear()
                        try:
                            await gradium_ws.send(json.dumps({"type": "end_of_stream"}))
                        except websockets.ConnectionClosed:
                            pass
                        return
        except WebSocketDisconnect:
            return

    async def from_upstream() -> None:
        try:
            async for raw in gradium_ws:
                if isinstance(raw, bytes):
                    continue
                try:
                    evt = json.loads(raw)
                except json.JSONDecodeError:
                    continue
                et = evt.get("type")
                if et == "text":
                    chunk = (evt.get("text") or "").strip()
                    if not chunk:
                        continue
                    state["buffer"] = (state["buffer"] + " " + chunk).strip()
                    state["last_text_at"] = time.monotonic()
                    await _safe_send_json(ws, {
                        "type": "transcript",
                        "text": state["buffer"],
                        "final": False,
                    })
                elif et == "end_text":
                    await emit_final()
                    return
                elif et == "error":
                    await _safe_send_json(ws, {
                        "type": "error",
                        "message": evt.get("message", "upstream error"),
                    })
                    return
        except websockets.ConnectionClosed:
            return

    async def silence_watcher() -> None:
        while not state["final_sent"] and not state["client_ended"]:
            await asyncio.sleep(0.2)
            if not state["buffer"]:
                continue
            if time.monotonic() - state["last_text_at"] >= silence_threshold_s:
                await emit_final()
                return

    tasks = [
        asyncio.create_task(from_client(), name="from_client"),
        asyncio.create_task(from_upstream(), name="from_upstream"),
        asyncio.create_task(silence_watcher(), name="silence_watcher"),
    ]

    try:
        # Wait until any task finishes (client end, upstream end, or silence flush).
        done, pending = await asyncio.wait(tasks, return_when=asyncio.FIRST_COMPLETED)

        # If the client signaled end but we haven't seen a final yet, give the
        # upstream a brief grace window to flush before we synthesize one.
        if state["client_ended"] and not state["final_sent"]:
            try:
                await asyncio.wait_for(asyncio.gather(*pending, return_exceptions=True), timeout=0.6)
            except asyncio.TimeoutError:
                pass

        if not state["final_sent"]:
            await emit_final()
    finally:
        for t in tasks:
            if not t.done():
                t.cancel()
        await asyncio.gather(*tasks, return_exceptions=True)


async def _safe_send_json(ws: WebSocket, payload: dict) -> None:
    try:
        await ws.send_json(payload)
    except Exception:
        pass
