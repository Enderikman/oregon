import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence } from "framer-motion";
import { Undo2, X } from "lucide-react";
import finaleLandscape from "@/assets/finale-landscape.jpg";
import { ClarifyStoreProvider, useClarifyMessages, useSharedClarify } from "@/hooks/use-clarify";
import { useDeck } from "@/hooks/use-deck";
import { useQuizKeyboard } from "@/hooks/use-quiz-keyboard";
import { useUIMode } from "@/hooks/use-ui-mode";
import { useQuizSession } from "@/lib/quiz-api";
import type { Decision, Question } from "@/lib/quiz-types";
import { CardStack } from "./card-stack";
import { ProgressBar } from "./progress-bar";
import { EndScreen } from "./end-screen";
import { ModeSwitch } from "./mode-switch";
import { EasyActionBar } from "./easy-action-bar";
import { AIWindow } from "./ai-window";
import { FollowupPrompt } from "./followup-prompt";
import {
  ContextSummaryProvider,
  ContextSummaryRail,
  useContextSummaryComponent,
} from "./context-summaries";

interface Props {
  sessionId: string;
}

export function QuizPage({ sessionId }: Props) {
  return (
    <ClarifyStoreProvider>
      <ContextSummaryProvider Component={ContextSummaryRail}>
        <QuizPageInner sessionId={sessionId} />
      </ContextSummaryProvider>
    </ClarifyStoreProvider>
  );
}

function CurrentSummary({ question }: { question: Question }) {
  const Summary = useContextSummaryComponent();
  const messages = useClarifyMessages(question.id);
  const { loading } = useSharedClarify(question);
  if (!Summary) return null;
  return <Summary messages={messages} loading={loading} />;
}

function QuizPageInner({ sessionId }: Props) {
  const { questions, loading, error, submitDecision, finalizeSession } = useQuizSession(sessionId);

  const deck = useMemo(() => questions, [questions]);
  const storageKey = `qontext.quiz.deck.${sessionId}`;
  const { current, upcoming, finished, index, total, history, decide, undo, reset } = useDeck(
    deck,
    storageKey,
  );

  const [clarifyOpen, setClarifyOpen] = useState(false);
  const [pendingDecision, setPendingDecision] = useState<Decision | null>(null);
  const [mode, , toggleMode] = useUIMode();
  const easy = mode === "easy";

  const startedAtRef = useRef<string>(new Date().toISOString());
  const finalizedRef = useRef(false);

  useEffect(() => {
    setClarifyOpen(false);
    setPendingDecision(null);
  }, [current?.id]);

  useEffect(() => {
    if (!finished || finalizedRef.current || total === 0) return;
    finalizedRef.current = true;
    finalizeSession(history, startedAtRef.current);
  }, [finished, total, history, finalizeSession]);

  const remaining = total - index;
  const avgMs = history.length
    ? history.slice(-5).reduce((a, h) => a + h.durationMs, 0) / Math.min(5, history.length)
    : 3500;
  const etaSec = Math.max(1, Math.round((avgMs * remaining) / 1000));

  function commit(decision: Decision, followupText?: string) {
    if (!current) return;
    decide(decision, followupText);
    submitDecision({
      questionId: current.id,
      decision: String(decision),
      durationMs: 0,
      followupText,
    });
  }

  function handleDecide(decision: Decision) {
    if (!current) return;
    setClarifyOpen(false);
    if (decision !== "skip" && decision !== "dont_know" && current.followup) {
      setPendingDecision(decision);
      return;
    }
    commit(decision);
    if ("vibrate" in navigator) navigator.vibrate?.(10);
  }

  function handleFollowupSubmit(text: string) {
    if (!pendingDecision) return;
    commit(pendingDecision, text);
    setPendingDecision(null);
  }

  function handleFollowupSkip() {
    if (!pendingDecision) return;
    commit(pendingDecision);
    setPendingDecision(null);
  }

  const isYesNo = current?.type === "yesno";
  useQuizKeyboard(
    {
      onYes: () => current && isYesNo && !clarifyOpen && !pendingDecision && handleDecide("yes"),
      onNo: () => current && isYesNo && !clarifyOpen && !pendingDecision && handleDecide("no"),
      onSkip: () => current && !clarifyOpen && !pendingDecision && handleDecide("skip"),
      onClarify: () => current && !pendingDecision && setClarifyOpen((o) => !o),
      onUndo: () => !clarifyOpen && !pendingDecision && undo(),
    },
    !finished && !easy,
  );

  useEffect(() => {
    if (easy || finished || !current || current.type !== "choice") return;
    const opts = current.options;
    const handler = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (clarifyOpen || pendingDecision) return;
      if (e.key.length !== 1) return;
      const n = Number(e.key);
      if (Number.isInteger(n) && n >= 1 && n <= Math.min(opts.length, 9)) {
        e.preventDefault();
        handleDecide(opts[n - 1]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [easy, finished, current, clarifyOpen, pendingDecision]);

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-background">
        <div className="text-sm text-muted-foreground font-mono uppercase tracking-widest">
          Loading queue…
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="grid min-h-screen place-items-center bg-background px-6 text-center">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-wide text-ink-soft">
            Couldn't load questions
          </div>
          <h1 className="mt-2 text-2xl text-foreground">{error}</h1>
          <Link to="/" className="mt-6 inline-block text-sm text-accent-ink underline">
            Back to cockpit
          </Link>
        </div>
      </main>
    );
  }

  if (total === 0) {
    return (
      <main className="fixed inset-0 overflow-hidden">
        <img
          src={finaleLandscape}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
        <div className="relative z-10 flex h-full w-full items-end px-6 pb-12 sm:px-12 sm:pb-16">
          <div className="max-w-[640px] text-white">
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/70">
              Nothing to teach
            </div>
            <h1 className="mt-2 text-4xl sm:text-5xl font-light tracking-tight">
              Your queue is empty.
            </h1>
            <p className="mt-3 text-sm sm:text-base text-white/80 max-w-md">
              The AI has no open questions for you right now.
            </p>
            <Link
              to="/"
              className="mt-8 inline-block rounded-full px-6 py-3 text-sm font-medium bg-white text-black hover:opacity-90 transition active:scale-[0.98]"
            >
              Back to cockpit
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="h-[100svh] min-h-[100svh] w-full bg-background flex flex-col overflow-hidden">
      <header className="w-full px-5 pt-5 sm:pt-7 max-w-[460px] mx-auto">
        <div className="flex items-center justify-between gap-3">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-medium flex items-center gap-2 font-mono">
            <Link
              to="/"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Exit quiz"
            >
              <X className="w-4 h-4" />
            </Link>
            Resolve
          </div>
          <div className="flex items-center gap-1">
            <ModeSwitch mode={mode} onToggle={toggleMode} />
            <button
              onClick={undo}
              disabled={history.length === 0}
              aria-label="Undo last decision"
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:hover:bg-transparent transition"
            >
              <Undo2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="mt-3">
          <ProgressBar value={index} total={total} />
          <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
            <span>
              <span className="text-foreground font-medium">{index}</span> / {total} resolved
            </span>
            {!finished && remaining > 0 && (
              <span>~{etaSec < 60 ? `${etaSec}s` : `${Math.round(etaSec / 60)}m`} left</span>
            )}
          </div>
        </div>
      </header>

      <section className="flex-1 min-h-0 flex items-stretch justify-center px-5 py-4 sm:py-8">
        {finished ? (
          <EndScreen history={history} total={total} onReset={reset} />
        ) : (
          <div className="w-full h-full flex flex-col items-center min-h-0">
            <CardStack
              current={current}
              upcoming={upcoming}
              onDecide={handleDecide}
              onClarify={() => setClarifyOpen(true)}
              easy={easy}
            />
            {easy && current && (
              <EasyActionBar
                question={current}
                onDecide={handleDecide}
                onClarify={() => setClarifyOpen(true)}
              />
            )}
          </div>
        )}
      </section>

      <footer className="w-full px-5 pb-6 max-w-[640px] mx-auto">
        <p className="text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70 font-mono">
          {easy
            ? "Tap a button to answer · Switch to Pro for shortcuts & swipes"
            : "← No · ↑ Skip · → Yes · Space ask AI · Z undo"}
        </p>
      </footer>

      {current && <CurrentSummary question={current} />}
      {current && (
        <AIWindow question={current} open={clarifyOpen} onClose={() => setClarifyOpen(false)} />
      )}

      <AnimatePresence>
        {current && pendingDecision && (
          <FollowupPrompt
            question={current}
            pendingDecision={String(pendingDecision)}
            onSubmit={handleFollowupSubmit}
            onSkip={handleFollowupSkip}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
