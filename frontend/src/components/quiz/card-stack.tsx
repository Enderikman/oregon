import { AnimatePresence } from "framer-motion";
import type { Decision, Question } from "@/lib/quiz-types";
import { SwipeCard } from "./swipe-card";

type Props = {
  current?: Question;
  upcoming: Question[];
  onDecide: (decision: Decision, source: "swipe" | "click" | "key") => void;
  onClarify: () => void;
  easy?: boolean;
};

export function CardStack({ current, upcoming, onDecide, onClarify, easy }: Props) {
  return (
    <div
      className="relative mx-auto flex-1 min-h-0 w-full max-w-[420px]"
      style={{
        aspectRatio: "3 / 4.4",
        maxWidth: "min(420px, calc((100svh - 280px) * 3 / 4.4))",
      }}
    >
      {upcoming
        .slice()
        .reverse()
        .map((q, i) => {
          const depth = upcoming.length - i;
          return (
            <SwipeCard
              key={q.id}
              question={q}
              onDecide={() => {}}
              onClarify={() => {}}
              isTop={false}
              depth={depth}
              easy={easy}
            />
          );
        })}

      <AnimatePresence mode="popLayout">
        {current && (
          <SwipeCard
            key={current.id}
            question={current}
            onDecide={onDecide}
            onClarify={onClarify}
            isTop
            depth={0}
            easy={easy}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
