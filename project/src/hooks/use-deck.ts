import { useCallback, useEffect, useReducer, useRef } from "react";
import type { Decision, HistoryEntry, Question } from "@/lib/quiz-types";

type State = {
  index: number;
  history: HistoryEntry[];
};

type Action =
  | { type: "decide"; entry: HistoryEntry }
  | { type: "undo" }
  | { type: "reset" }
  | { type: "hydrate"; state: State };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "decide":
      return { index: state.index + 1, history: [...state.history, action.entry] };
    case "undo":
      if (state.history.length === 0) return state;
      return { index: Math.max(0, state.index - 1), history: state.history.slice(0, -1) };
    case "reset":
      return { index: 0, history: [] };
    case "hydrate":
      return action.state;
    default:
      return state;
  }
}

export function useDeck(deck: Question[], storageKey: string) {
  const [state, dispatch] = useReducer(reducer, { index: 0, history: [] });
  const cardShownAt = useRef<number>(Date.now());

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as State;
        if (parsed && typeof parsed.index === "number") {
          dispatch({ type: "hydrate", state: parsed });
        }
      }
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, storageKey]);

  useEffect(() => {
    cardShownAt.current = Date.now();
  }, [state.index]);

  const current = deck[state.index];
  const upcoming = deck.slice(state.index + 1, state.index + 3);
  const finished = deck.length > 0 && state.index >= deck.length;

  const decide = useCallback(
    (decision: Decision, followupText?: string) => {
      if (!current) return;
      const entry: HistoryEntry = {
        questionId: current.id,
        decision,
        durationMs: Date.now() - cardShownAt.current,
        at: Date.now(),
        followupText,
      };
      dispatch({ type: "decide", entry });
      return entry;
    },
    [current],
  );

  const undo = useCallback(() => dispatch({ type: "undo" }), []);
  const reset = useCallback(() => dispatch({ type: "reset" }), []);

  return {
    current,
    upcoming,
    finished,
    index: state.index,
    total: deck.length,
    history: state.history,
    decide,
    undo,
    reset,
  };
}
