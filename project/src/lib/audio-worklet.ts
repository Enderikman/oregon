// Tiny AudioWorklet for mic-side downsample + PCM16 framing.
//
// We inline the worklet source as a string and ship it to the AudioContext
// via `URL.createObjectURL`. This avoids any Vite asset-pipeline gymnastics
// (no `.worklet.ts` build step, no public-dir copies).
//
// The worklet reads the browser's native sample rate (typically 48 kHz),
// linearly interpolates to 24 kHz, and emits 16-bit little-endian PCM
// frames of `frameSamples` samples each. The bytes are posted back to the
// main thread as `ArrayBuffer`s, ready for `WebSocket.send`.

const WORKLET_SOURCE = /* js */ `
class MicDownsampler extends AudioWorkletProcessor {
  constructor(options) {
    super();
    const opts = (options && options.processorOptions) || {};
    this.sourceSampleRate = opts.sourceSampleRate || sampleRate;
    this.targetSampleRate = opts.targetSampleRate || 24000;
    this.frameSamples = opts.frameSamples || 960;
    this.ratio = this.sourceSampleRate / this.targetSampleRate;
    this._readPos = 0;
    this._inputBuffer = new Float32Array(0);
    this._frameBuffer = new Int16Array(this.frameSamples);
    this._frameWritten = 0;
  }

  _appendInput(chunk) {
    if (chunk.length === 0) return;
    const merged = new Float32Array(this._inputBuffer.length + chunk.length);
    merged.set(this._inputBuffer, 0);
    merged.set(chunk, this._inputBuffer.length);
    this._inputBuffer = merged;
  }

  _consumeInput(n) {
    if (n <= 0) return;
    if (n >= this._inputBuffer.length) {
      this._inputBuffer = new Float32Array(0);
    } else {
      this._inputBuffer = this._inputBuffer.slice(n);
    }
  }

  _flushFrame() {
    // Copy out — we keep _frameBuffer for reuse, but we must transfer a
    // fresh ArrayBuffer to the main thread.
    const out = new Int16Array(this.frameSamples);
    out.set(this._frameBuffer);
    this.port.postMessage(out.buffer, [out.buffer]);
    this._frameWritten = 0;
  }

  process(inputs) {
    const channel = inputs && inputs[0] && inputs[0][0];
    if (!channel || channel.length === 0) return true;

    this._appendInput(channel);

    // How many input samples we can actually consume right now: leave
    // one trailing sample so linear interpolation never reads past the
    // end on this pass.
    const readEnd = this._inputBuffer.length - 1;
    if (readEnd <= 0) return true;

    let consumedUpTo = 0;
    while (this._readPos < readEnd) {
      const idx = this._readPos;
      const i0 = Math.floor(idx);
      const frac = idx - i0;
      const s0 = this._inputBuffer[i0];
      const s1 = this._inputBuffer[i0 + 1];
      let sample = s0 + (s1 - s0) * frac;
      // Clamp + scale to int16 range.
      if (sample > 1) sample = 1;
      else if (sample < -1) sample = -1;
      this._frameBuffer[this._frameWritten++] = sample < 0
        ? Math.round(sample * 0x8000)
        : Math.round(sample * 0x7fff);

      if (this._frameWritten >= this.frameSamples) {
        this._flushFrame();
      }

      this._readPos += this.ratio;
      consumedUpTo = i0;
    }

    // Drop fully-consumed input; keep the tail (at least one sample +
    // any unread samples ahead of consumedUpTo) for the next pass.
    if (consumedUpTo > 0) {
      this._consumeInput(consumedUpTo);
      this._readPos -= consumedUpTo;
    }

    return true;
  }
}

registerProcessor("mic-downsampler", MicDownsampler);
`;

export interface MicWorkletOptions {
  targetSampleRate: number;
  frameSamples: number;
}

/**
 * Build a Blob URL pointing at the inline worklet source. The caller is
 * responsible for `URL.revokeObjectURL` once `addModule` has resolved.
 *
 * (Options are baked into the source via the `processorOptions` mechanism
 * at instantiation time — they're accepted here for future use.)
 */
export function createMicWorkletUrl(_options: MicWorkletOptions): string {
  if (typeof window === "undefined") {
    throw new Error("audio-worklet must run in the browser");
  }
  const blob = new Blob([WORKLET_SOURCE], { type: "application/javascript" });
  return URL.createObjectURL(blob);
}
