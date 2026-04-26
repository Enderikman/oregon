import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useMemoryStore } from "@/lib/memory-context";
import { isSpeechSupported, speak, startDictation } from "@/lib/speech";
import type { AIQuestion } from "@/lib/types";
import { QuestionProgress } from "./question-progress";
import { VoiceStage } from "./voice-stage";
import type { TranscriptEntry } from "./transcript-stream";
import { InterviewSummary } from "./interview-summary";

type Phase = "idle" | "speaking" | "listening" | "confirming" | "processing" | "done";

interface ResolvedPair {
  question: AIQuestion;
  answer: string;
}

interface Props {
  sessionId: string;
}

function matchAnswer(q: AIQuestion, transcript: string): string | null {
  const t = transcript.toLowerCase().trim();
  if (!q.candidates || q.candidates.length === 0) return null;
  for (const c of q.candidates) {
    if (t.includes(c.toLowerCase())) return c;
  }
  if (/(^|\b)(yes|same|correct|merge)\b/.test(t)) return q.candidates[0];
  if (/(^|\b)(no|different|separate|distinct)\b/.test(t) && q.candidates[1]) return q.candidates[1];
  return null;
}

export function InterviewPage({ sessionId }: Props) {
  const { questions, resolveQuestion, recordSession } = useMemoryStore();

  // Snapshot the queue when the session opens, so resolving one doesn't
  // re-shuffle the order under the user.
  const initialQueue = useMemo<AIQuestion[]>(() => {
    return questions
      .filter((q) => q.status === "open")
      .sort((a, b) => {
        const ai = a.affectedFactIds.length + a.unblocksQuestionIds.length * 2;
        const bi = b.affectedFactIds.length + b.unblocksQuestionIds.length * 2;
        return bi - ai;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [interim, setInterim] = useState("");
  const [pendingAnswer, setPendingAnswer] = useState<string>("");
  const [pendingAnswerEdited, setPendingAnswerEdited] = useState<boolean>(false);
  const [resolved, setResolved] = useState<ResolvedPair[]>([]);
  const [skipped, setSkipped] = useState<AIQuestion[]>([]);
  const startedAtRef = useRef<string>(new Date().toISOString());
  const recordedRef = useRef<boolean>(false);

  const cleanupRef = useRef<(() => void) | null>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pttKeyDownAtRef = useRef<number>(0);
  const pttMicWasOnRef = useRef<boolean>(false);
  const voiceSupported = isSpeechSupported();
  const PTT_TAP_MS = 130;

  const total = initialQueue.length;
  const current = initialQueue[currentIndex];
  const isDone = !current || phase === "done";

  const stopAll = () => {
    cleanupRef.current?.();
    cleanupRef.current = null;
    if (advanceTimer.current) {
      clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
    // Note: HTTP-based TTS has no equivalent of speechSynthesis.cancel();
    // playback runs to completion. Bot-interrupt is a no-op for now.
  };

  const appendAgent = (text: string) =>
    setTranscript((prev) => [
      ...prev,
      { id: `agent-${prev.length}-${Date.now()}`, speaker: "agent", text, ts: Date.now() },
    ]);
  const appendYou = (text: string) =>
    setTranscript((prev) => [
      ...prev,
      { id: `you-${prev.length}-${Date.now()}`, speaker: "you", text, ts: Date.now() },
    ]);

  const askCurrent = (q: AIQuestion) => {
    stopAll();
    setInterim("");
    setPhase("speaking");
    appendAgent(q.question);

    void (async () => {
      try {
        await speak(q.question);
        beginListening(q);
      } catch {
        // Fallback: pretend we asked, then move to listening
        advanceTimer.current = setTimeout(() => beginListening(q), 1200);
      }
    })();
  };

  const beginListening = (q: AIQuestion) => {
    if (!voiceSupported) {
      setPhase("listening"); // still show the listening UI; user must tap a candidate
      return;
    }
    setPhase("listening");
    cleanupRef.current = startDictation(
      (t) => setInterim(t),
      (t) => {
        const matched = matchAnswer(q, t);
        if (matched) {
          stageAnswer(matched);
        } else if (q.type === "gap" || (q.type === "conflict" && t.trim().length > 4)) {
          stageAnswer(t.trim());
        }
      },
    );
  };

  const stageAnswer = (choice: string) => {
    if (!current) return;
    stopAll();
    setInterim("");
    setPendingAnswer(choice);
    setPendingAnswerEdited(false);
    setPhase("confirming");
  };

  const handleConfirm = () => {
    if (!current || !pendingAnswer) return;
    const choice = pendingAnswer;
    setPhase("processing");
    appendYou(choice);
    resolveQuestion(current.id, choice);
    setResolved((prev) => [...prev, { question: current, answer: choice }]);
    setPendingAnswer("");
    setPendingAnswerEdited(false);
    advanceTimer.current = setTimeout(() => goNext(), 600);
  };

  const handleEditCommit = (text: string) => {
    setPendingAnswer(text);
    setPendingAnswerEdited(true);
  };

  const handleEdit = () => {
    setPendingAnswer("");
    setPendingAnswerEdited(false);
    if (current) {
      askCurrent(current);
    }
  };

  const handleDismiss = () => {
    setPendingAnswer("");
    setPendingAnswerEdited(false);
    if (current) beginListening(current);
  };

  // Direct-tap on a candidate chip skips confirmation (explicit click = explicit intent)
  const handleResolve = (choice: string) => {
    if (!current) return;
    stopAll();
    setInterim("");
    setPhase("processing");
    appendYou(choice);
    resolveQuestion(current.id, choice);
    setResolved((prev) => [...prev, { question: current, answer: choice }]);
    advanceTimer.current = setTimeout(() => goNext(), 700);
  };

  const goNext = () => {
    setCurrentIndex((i) => {
      const next = i + 1;
      if (next >= total) {
        setPhase("done");
        appendAgent("Interview complete. Thank you.");
        return i;
      }
      return next;
    });
  };

  // Record the session exactly once when it ends
  useEffect(() => {
    if (phase !== "done" || recordedRef.current) return;
    recordedRef.current = true;
    const endedAt = new Date().toISOString();
    const startedAt = startedAtRef.current;
    const topic =
      resolved[0]?.question.question ?? initialQueue[0]?.question ?? "Interview session";
    recordSession({
      id: sessionId,
      mode: "voice",
      startedAt,
      endedAt,
      durationMs: new Date(endedAt).getTime() - new Date(startedAt).getTime(),
      questionsAnswered: resolved.length,
      questionsSkipped: skipped.length,
      topic,
      questionIds: initialQueue.map((q) => q.id),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // Auto-start when the current question changes
  useEffect(() => {
    if (!current || phase === "done") return;
    askCurrent(current);
    return () => {
      stopAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, sessionId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopAll();
  }, []);

  // Space-key mic control: tap to toggle, hold for push-to-talk.
  // Mirrors the standalone voice-agent UI behavior — short press flips
  // dictation on/off; long press keeps the mic open while held.
  useEffect(() => {
    const isEditableTarget = (target: EventTarget | null): boolean => {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return true;
      if (target.isContentEditable) return true;
      return false;
    };

    const canToggleMic = (): boolean => {
      // Don't try to drive the mic during phases where it isn't meaningful.
      if (!current) return false;
      if (phase === "done" || phase === "processing" || phase === "confirming") {
        return false;
      }
      return true;
    };

    const startMic = () => {
      if (!canToggleMic()) return;
      if (cleanupRef.current) return; // already listening
      beginListening(current);
    };

    const stopMic = () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
      setInterim("");
      // Drop back to idle so the orb stops pulsing as "listening".
      if (phase === "listening") setPhase("idle");
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== "Space" || e.repeat) return;
      if (isEditableTarget(e.target)) return;
      e.preventDefault();
      if (pttKeyDownAtRef.current !== 0) return;
      pttKeyDownAtRef.current = Date.now();
      pttMicWasOnRef.current = !!cleanupRef.current;
      // Open mic immediately so hold-to-talk feels instant. A tap that
      // happened with the mic already on is reconciled on keyup.
      if (!cleanupRef.current) startMic();
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      if (pttKeyDownAtRef.current === 0) return;
      const elapsed = Date.now() - pttKeyDownAtRef.current;
      const wasOnBefore = pttMicWasOnRef.current;
      pttKeyDownAtRef.current = 0;
      pttMicWasOnRef.current = false;
      if (isEditableTarget(e.target)) return;
      e.preventDefault();
      if (elapsed < PTT_TAP_MS) {
        // Tap — toggle relative to the pre-press state.
        if (wasOnBefore) {
          stopMic();
        }
        // else: keydown already started the mic; leave it on.
      } else {
        // Hold release — classic PTT, close the mic.
        stopMic();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, current]);

  // Empty queue (nothing was open when the route loaded)
  if (total === 0) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-6 text-center">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-wide text-ink-soft">
            Nothing to teach
          </div>
          <h1 className="mt-2 text-[24px] text-ink">Your queue is empty.</h1>
          <p className="mt-2 text-[14px] text-ink-muted">
            The AI has no open questions for you right now.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block rounded-full px-5 py-2.5 text-[13px] font-medium"
            style={{ backgroundColor: "var(--accent)", color: "white" }}
          >
            Back to cockpit
          </Link>
        </div>
      </div>
    );
  }

  if (isDone) {
    return (
      <main className="min-h-screen bg-background">
        <header className="border-b border-border bg-surface/60 backdrop-blur">
          <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
            <div className="font-mono text-[11px] uppercase tracking-wide text-ink-soft">
              Live interview · session {sessionId}
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] text-ink-muted hover:bg-surface-2 hover:text-ink"
            >
              <X size={13} />
              Close
            </Link>
          </div>
        </header>
        <InterviewSummary resolved={resolved} skipped={skipped} transcript={transcript} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-surface/80 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-6 py-3.5">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              onClick={stopAll}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] text-ink-muted hover:bg-surface-2 hover:text-ink"
            >
              <X size={13} />
              End interview
            </Link>
            <div className="hidden h-4 w-px bg-border sm:block" />
            <div className="font-mono text-[11px] uppercase tracking-wide text-ink-soft">
              Live interview
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1200px] px-6 py-8">
        {!voiceSupported && (
          <div
            className="mb-6 rounded-[14px] border border-border px-4 py-3 text-[13px] text-ink-muted"
            style={{ backgroundColor: "var(--warning-soft)", color: "var(--warning)" }}
          >
            Voice input isn't supported in this browser. Use the candidate buttons or skip to
            continue.
          </div>
        )}

        <div className="mx-auto flex max-w-[760px] flex-col gap-6">
          <QuestionProgress questions={initialQueue} currentIndex={currentIndex} />
          <div className="min-h-[560px]">
            <VoiceStage
              q={current}
              phase={phase}
              pendingAnswer={pendingAnswer}
              pendingAnswerEdited={pendingAnswerEdited}
              onConfirm={handleConfirm}
              onEdit={handleEdit}
              onEditCommit={handleEditCommit}
              onDismiss={handleDismiss}
              onCandidate={handleResolve}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
