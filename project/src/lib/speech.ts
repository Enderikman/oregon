// Speech bridge — talks to the voice-agent backend instead of the browser's
// Web Speech API. Set `VITE_VOICE_AGENT_URL` in `.env` (e.g.
// `http://localhost:8001`) — the agent exposes `/api/tts` (HTTP POST → wav)
// and `/api/stt` (WebSocket bridge). There is NO Web Speech fallback;
// without the service, dictation/synthesis surface a clear console error
// and become no-ops.

import { createMicWorkletUrl } from "./audio-worklet";

type DictationCleanup = () => void;

interface DictationOptions {
  language?: string;
  /** Called when the bridge fails to connect — message is human-readable. */
  onError?: (message: string) => void;
  /**
   * Seconds of silence after the last transcript chunk before the bridge
   * promotes the accumulated text to a final transcript. Default 2.5s.
   * Lower values feel more responsive but cut off pauses; higher values
   * are forgiving but delay the final callback. Forwarded to the server's
   * `/api/stt` setup message.
   */
  silenceThresholdSec?: number;
}

interface SpeakOptions {
  language?: string;
  voiceId?: string | null;
  /** Optional `<audio>` element to render through; one is created otherwise. */
  audioEl?: HTMLAudioElement;
}

const TARGET_SAMPLE_RATE = 24_000;
const FRAME_SAMPLES = 960; // 40 ms at 24 kHz, slightly under Gradium's 80 ms ceiling

function getServiceUrl(): string | null {
  if (typeof import.meta === "undefined") return null;
  const url = import.meta.env?.VITE_VOICE_AGENT_URL;
  if (!url || typeof url !== "string") return null;
  return url.replace(/\/$/, "");
}

function logMissingService(scope: string): void {
  console.error(
    `[speech.${scope}] VITE_VOICE_AGENT_URL is not set — voice features are disabled. ` +
      "Add VITE_VOICE_AGENT_URL=http://localhost:8001 to .env and restart the dev server.",
  );
}

/**
 * Returns true when the browser has the APIs needed to capture mic audio
 * AND a voice-agent URL is configured. Components use this as a feature
 * flag to swap in tap-only fallback UI (candidate buttons, manual input).
 */
export function isSpeechSupported(): boolean {
  if (typeof window === "undefined") return false;
  if (!getServiceUrl()) return false;
  const w = window as unknown as {
    AudioContext?: unknown;
    webkitAudioContext?: unknown;
    MediaRecorder?: unknown;
  };
  const hasAudio = Boolean(w.AudioContext || w.webkitAudioContext);
  const hasMedia = Boolean(navigator?.mediaDevices?.getUserMedia);
  return hasAudio && hasMedia;
}

/**
 * Speak text via Gradium TTS through the voice-agent bridge. Returns a
 * Promise that resolves on `ended` (or rejects on error). NOT currently
 * imported by the existing UI — it speaks via `window.speechSynthesis` —
 * but exported so future callers can route TTS through the bridge too.
 */
export async function speak(text: string, opts: SpeakOptions = {}): Promise<void> {
  if (typeof window === "undefined") return;
  const base = getServiceUrl();
  if (!base) {
    logMissingService("speak");
    throw new Error("voice-agent URL not configured");
  }
  if (!text.trim()) return;

  const res = await fetch(`${base}/api/tts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      language: opts.language ?? "en",
      voice_id: opts.voiceId ?? null,
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`tts request failed: HTTP ${res.status} ${detail.slice(0, 200)}`);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  return new Promise<void>((resolve, reject) => {
    const audio = opts.audioEl ?? new Audio();
    const cleanup = () => {
      try {
        URL.revokeObjectURL(url);
      } catch {
        /* ignore */
      }
    };
    audio.onended = () => {
      cleanup();
      resolve();
    };
    audio.onerror = () => {
      cleanup();
      reject(new Error("tts audio playback failed"));
    };
    audio.src = url;
    audio.play().catch((err) => {
      cleanup();
      reject(err instanceof Error ? err : new Error(String(err)));
    });
  });
}

/**
 * Start dictation by streaming mic audio to the voice-agent STT bridge.
 *
 * The signature mirrors the original Web-Speech-API version: an `onInterim`
 * callback fires for each partial transcript chunk and `onFinal` fires for
 * each finalized utterance. The returned cleanup function tears down the
 * AudioWorklet, mic stream, and WebSocket.
 */
export function startDictation(
  onInterim: (text: string) => void,
  onFinal: (text: string) => void,
  opts: DictationOptions = {},
): DictationCleanup {
  if (typeof window === "undefined") return () => {};
  const base = getServiceUrl();
  if (!base) {
    logMissingService("startDictation");
    opts.onError?.("voice-agent URL not configured");
    return () => {};
  }

  let stopped = false;
  let cleanupAudio: (() => void) | null = null;
  let socket: WebSocket | null = null;
  let interimBuffer = "";
  let finalEmitted = false;

  const wsUrl = `${base.replace(/^http/, "ws")}/api/stt`;

  // How long to wait after sending {type:"end"} for the bridge to flush a
  // final:true transcript before we close the socket. Short utterances
  // ("yes", "no") need this — the user releases the mic before Gradium
  // has emitted any text events, so the final arrives a few hundred ms
  // after our `end`. If we close the WS first, the message is lost.
  const FLUSH_GRACE_MS = 500;

  const closeSocket = () => {
    try {
      socket?.close();
    } catch {
      /* ignore */
    }
    socket = null;
  };

  const teardown: DictationCleanup = () => {
    if (stopped) return;
    stopped = true;

    // Stop the mic immediately — we want no further audio frames going
    // upstream while we wait for the final flush.
    cleanupAudio?.();
    cleanupAudio = null;

    const ws = socket;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      closeSocket();
      return;
    }

    // Send {type:"end"} and then wait briefly for the bridge to send a
    // final:true transcript. Once we get it (or the timeout fires), we
    // close. The onmessage handler still runs during this window because
    // the socket is open — it'll call onFinal as usual.
    try {
      ws.send(JSON.stringify({ type: "end" }));
    } catch {
      closeSocket();
      return;
    }

    let closed = false;
    const closeOnce = () => {
      if (closed) return;
      closed = true;
      closeSocket();
    };

    const timeoutId = window.setTimeout(() => {
      // Last-chance: if no final:true came back in time AND we never
      // emitted via onmessage, promote whatever interim we have.
      if (!finalEmitted) {
        const pending = interimBuffer.trim();
        interimBuffer = "";
        if (pending) {
          finalEmitted = true;
          onFinal(pending);
        }
      }
      closeOnce();
    }, FLUSH_GRACE_MS);

    // If the socket is closed by the server (after it emitted final),
    // the existing onclose handler runs — clear the timer and we're done.
    const prevOnClose = ws.onclose;
    ws.onclose = (ev) => {
      window.clearTimeout(timeoutId);
      try {
        prevOnClose?.call(ws, ev);
      } catch {
        /* ignore */
      }
      closeOnce();
    };
  };

  (async () => {
    try {
      socket = new WebSocket(wsUrl);
      socket.binaryType = "arraybuffer";

      const opened = new Promise<void>((resolve, reject) => {
        if (!socket) return reject(new Error("socket gone"));
        socket.onopen = () => resolve();
        socket.onerror = () => reject(new Error("stt websocket error"));
      });

      socket.onmessage = (ev) => {
        if (typeof ev.data !== "string") return;
        let msg: { type?: string; text?: string; final?: boolean; message?: string };
        try {
          msg = JSON.parse(ev.data);
        } catch {
          return;
        }
        if (msg.type === "transcript") {
          // The bridge emits the FULL accumulated transcript on every
          // `text` event — `text` is the running utterance, not a new
          // chunk to append. So we replace `interimBuffer` rather than
          // concatenate. `final:true` means "user has stopped speaking
          // (silence threshold elapsed or end signal received)" — the
          // text on that frame is the complete utterance.
          const text = msg.text ?? "";
          if (msg.final) {
            const finalText = (text || interimBuffer).trim();
            interimBuffer = "";
            if (finalText && !finalEmitted) {
              finalEmitted = true;
              onFinal(finalText);
            }
          } else if (text) {
            interimBuffer = text.replace(/\s+/g, " ").trimStart();
            onInterim(interimBuffer);
          }
        } else if (msg.type === "error") {
          console.error("[speech.startDictation] bridge error:", msg.message);
          opts.onError?.(msg.message ?? "speech bridge error");
          teardown();
        }
      };

      socket.onclose = () => {
        // If we still have buffered interim text on close, promote it —
        // covers cases where the server tore down without sending final
        // (e.g. abrupt upstream disconnect).
        if (finalEmitted) return;
        const pending = interimBuffer.trim();
        interimBuffer = "";
        if (pending) {
          finalEmitted = true;
          onFinal(pending);
        }
      };

      await opened;
      if (stopped || !socket) return;

      socket.send(
        JSON.stringify({
          type: "setup",
          language: opts.language ?? "en",
          silence_threshold_s: opts.silenceThresholdSec ?? 2.5,
        }),
      );

      // Start mic capture only after the socket is open.
      cleanupAudio = await startMicPipeline((pcm) => {
        if (stopped || !socket || socket.readyState !== WebSocket.OPEN) return;
        socket.send(pcm);
      });

      if (stopped) cleanupAudio?.();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[speech.startDictation] setup failed:", msg);
      opts.onError?.(msg);
      teardown();
    }
  })();

  return teardown;
}

// ---------------------------------------------------------------------------
// Mic capture pipeline: getUserMedia → AudioWorklet → 24 kHz PCM16 frames
// ---------------------------------------------------------------------------

type SendPcm = (frame: ArrayBuffer) => void;

async function startMicPipeline(send: SendPcm): Promise<() => void> {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      channelCount: 1,
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
  });

  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new AudioCtx();

  const workletUrl = createMicWorkletUrl({
    targetSampleRate: TARGET_SAMPLE_RATE,
    frameSamples: FRAME_SAMPLES,
  });

  try {
    await ctx.audioWorklet.addModule(workletUrl);
  } finally {
    URL.revokeObjectURL(workletUrl);
  }

  const source = ctx.createMediaStreamSource(stream);
  const node = new AudioWorkletNode(ctx, "mic-downsampler", {
    processorOptions: {
      sourceSampleRate: ctx.sampleRate,
      targetSampleRate: TARGET_SAMPLE_RATE,
      frameSamples: FRAME_SAMPLES,
    },
  });

  node.port.onmessage = (ev: MessageEvent<ArrayBuffer>) => {
    if (ev.data instanceof ArrayBuffer) send(ev.data);
  };

  source.connect(node);
  // Worklets don't need to be connected to destination, but Safari sometimes
  // refuses to start the audio graph otherwise. Use a muted sink.
  const sink = ctx.createGain();
  sink.gain.value = 0;
  node.connect(sink);
  sink.connect(ctx.destination);

  return () => {
    try {
      node.port.onmessage = null;
      node.disconnect();
    } catch {
      /* ignore */
    }
    try {
      source.disconnect();
    } catch {
      /* ignore */
    }
    try {
      sink.disconnect();
    } catch {
      /* ignore */
    }
    try {
      ctx.close();
    } catch {
      /* ignore */
    }
    for (const track of stream.getTracks()) {
      try {
        track.stop();
      } catch {
        /* ignore */
      }
    }
  };
}
