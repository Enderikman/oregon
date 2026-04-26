import { useState, useRef } from "react";
import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import { ArrowDown, ArrowUp, Check, Sparkles, X } from "lucide-react";
import type { Decision, Question } from "@/lib/quiz-types";
import { ContextChips } from "./context-chips";

type Props = {
  question: Question;
  onDecide: (decision: Decision) => void;
  onClarify: () => void;
  isTop: boolean;
  depth: number;
  easy?: boolean;
};

const SWIPE_THRESHOLD = 110;
const VELOCITY_THRESHOLD = 600;

export function SwipeCard({ question, onDecide, onClarify, isTop, depth, easy = false }: Props) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotate = useTransform(x, [-300, 0, 300], [-18, 0, 18]);
  const yesOpacity = useTransform(x, [40, 160], [0, 0.85]);
  const noOpacity = useTransform(x, [-160, -40], [0.85, 0]);
  const skipOpacity = useTransform(y, [-160, -40], [0.85, 0]);
  const dunnoOpacity = useTransform(y, [40, 160], [0, 0.85]);

  const [textValue, setTextValue] = useState("");
  const dragMoved = useRef(false);

  const allowYesNo = question.type === "yesno";

  function handleDragEnd(_: unknown, info: PanInfo) {
    const { offset, velocity } = info;
    const movedX = Math.abs(offset.x);
    const movedY = offset.y;

    if (allowYesNo && (offset.x > SWIPE_THRESHOLD || velocity.x > VELOCITY_THRESHOLD)) {
      onDecide("yes");
    } else if (allowYesNo && (offset.x < -SWIPE_THRESHOLD || velocity.x < -VELOCITY_THRESHOLD)) {
      onDecide("no");
    } else if (movedY < -SWIPE_THRESHOLD || velocity.y < -VELOCITY_THRESHOLD) {
      onDecide("skip");
    } else if (movedY > SWIPE_THRESHOLD || velocity.y > VELOCITY_THRESHOLD) {
      onDecide("dont_know");
    }
    if (movedX > 6 || Math.abs(movedY) > 6) dragMoved.current = true;
  }

  if (!isTop) {
    return (
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={false}
        animate={{
          scale: 1 - depth * 0.05,
          y: depth * 14,
          opacity: 1 - depth * 0.35,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
      >
        <div className="w-full h-full rounded-[var(--radius)] bg-card border border-border shadow-soft" />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ x, y, rotate }}
      drag
      dragElastic={allowYesNo ? 0.6 : { left: 0.08, right: 0.08, top: 0.6, bottom: 0.6 }}
      dragConstraints={allowYesNo ? undefined : { left: 0, right: 0 }}
      dragMomentum={false}
      onDragStart={() => {
        dragMoved.current = false;
      }}
      onDragEnd={handleDragEnd}
      exit={{
        x: x.get() > 0 ? 600 : x.get() < 0 ? -600 : 0,
        y: y.get() < -50 ? -600 : y.get() > 50 ? 600 : 0,
        opacity: 0,
        transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
      }}
    >
      <div
        className="relative w-full h-full rounded-[var(--radius)] bg-card border border-border shadow-soft overflow-hidden"
        style={{ userSelect: "none", WebkitUserSelect: "none" }}
      >
        {allowYesNo && (
          <>
            <motion.div
              className="absolute inset-0 pointer-events-none bg-swipe-yes/20"
              style={{ opacity: yesOpacity }}
            />
            <motion.div
              className="absolute inset-0 pointer-events-none bg-swipe-no/20"
              style={{ opacity: noOpacity }}
            />
          </>
        )}
        <motion.div
          className="absolute inset-0 pointer-events-none bg-swipe-skip/20"
          style={{ opacity: skipOpacity }}
        />
        <motion.div
          className="absolute inset-0 pointer-events-none bg-swipe-skip/10"
          style={{ opacity: dunnoOpacity }}
        />

        {allowYesNo && (
          <>
            <motion.div
              style={{ opacity: yesOpacity }}
              className="absolute top-8 right-8 px-3 py-1 rounded-md border-2 border-swipe-yes text-swipe-yes font-bold tracking-widest text-sm rotate-12"
            >
              YES
            </motion.div>
            <motion.div
              style={{ opacity: noOpacity }}
              className="absolute top-8 left-8 px-3 py-1 rounded-md border-2 border-swipe-no text-swipe-no font-bold tracking-widest text-sm -rotate-12"
            >
              NO
            </motion.div>
          </>
        )}
        <motion.div
          style={{ opacity: skipOpacity }}
          className="absolute top-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded-md border-2 border-swipe-skip text-swipe-skip font-bold tracking-widest text-sm"
        >
          SKIP
        </motion.div>
        <motion.div
          style={{ opacity: dunnoOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded-md border-2 border-muted-foreground text-muted-foreground font-bold tracking-widest text-sm"
        >
          CAN'T ANSWER
        </motion.div>

        <div className="h-full flex flex-col px-7 py-9">
          <div className="flex items-center justify-between">
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-medium font-mono">
              {question.type === "yesno" && "Decide"}
              {question.type === "choice" && "Choose"}
              {question.type === "text" && "Quick answer"}
            </div>
            <button
              type="button"
              onPointerDownCapture={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onClarify();
              }}
              className="relative z-10 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition px-2 py-1 rounded-md hover:bg-muted"
              title="Ask AI for context (Space)"
            >
              <Sparkles className="w-3 h-3" />
              Ask AI
              <kbd className="hidden sm:inline-flex ml-1 items-center justify-center min-w-[18px] h-[18px] px-1 rounded border border-border bg-muted text-[9px] font-mono text-muted-foreground normal-case tracking-normal">
                {easy ? "Click" : "Space"}
              </kbd>
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-balance text-3xl sm:text-4xl font-semibold leading-tight tracking-tight text-foreground">
              {question.question}
            </h2>

            {question.context && (
              <p className="mt-5 text-base text-muted-foreground leading-relaxed text-balance">
                {question.context}
              </p>
            )}

            {question.data && (
              <div className="mt-4">
                <ContextChips data={question.data} />
              </div>
            )}

            {question.why && (
              <p className="mt-4 text-xs uppercase tracking-widest text-muted-foreground/80 font-mono">
                · {question.why}
              </p>
            )}

            {question.type === "choice" && (
              <div
                className="relative z-10 mt-7 space-y-2"
                onPointerDownCapture={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <div className="grid grid-cols-2 gap-2">
                  {question.options.map((opt, i) => (
                    <button
                      key={opt}
                      type="button"
                      onPointerDownCapture={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDecide(opt);
                      }}
                      className="relative px-4 py-3 rounded-xl border border-border bg-secondary/60 hover:bg-accent active:scale-[0.98] transition text-sm font-medium text-foreground"
                    >
                      {!easy && i < 9 && (
                        <span className="absolute top-1 right-1.5 text-[9px] font-mono text-muted-foreground/40 tabular-nums">
                          {i + 1}
                        </span>
                      )}
                      {opt}
                    </button>
                  ))}
                </div>
                <form
                  onPointerDownCapture={(e) => e.stopPropagation()}
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (textValue.trim()) onDecide(textValue.trim());
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    value={textValue}
                    onChange={(e) => setTextValue(e.target.value)}
                    onPointerDownCapture={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Other… (type and press Enter)"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-dashed border-border bg-transparent text-sm text-foreground outline-none focus:ring-2 focus:ring-ring/30 placeholder:text-muted-foreground/60"
                  />
                  {textValue.trim() && (
                    <button
                      type="submit"
                      onPointerDownCapture={(e) => e.stopPropagation()}
                      className="px-3 py-2.5 rounded-xl bg-foreground text-background text-xs font-medium hover:opacity-90 transition"
                    >
                      Send
                    </button>
                  )}
                </form>
              </div>
            )}

            {question.type === "text" && (
              <form
                onPointerDownCapture={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                onSubmit={(e) => {
                  e.preventDefault();
                  if (textValue.trim()) onDecide(textValue.trim());
                }}
                className="relative z-10 mt-7"
              >
                <input
                  autoFocus
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  onPointerDownCapture={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Type and press Enter…"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/60 text-foreground outline-none focus:ring-2 focus:ring-ring/30"
                />
              </form>
            )}
          </div>

          {!easy && (
            <button
              type="button"
              onPointerDownCapture={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onDecide("dont_know");
              }}
              className="relative z-10 self-center inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition px-3 py-1.5 rounded-full hover:bg-muted"
            >
              <ArrowDown className="w-3.5 h-3.5" />
              I can't answer this
            </button>
          )}

          {!easy && question.type === "yesno" && (
            <div className="mt-4 flex items-center justify-between text-muted-foreground/50 text-[11px] uppercase tracking-widest font-mono">
              <span className="inline-flex items-center gap-1.5"><X className="w-3.5 h-3.5" /> No</span>
              <span className="inline-flex items-center gap-1.5"><ArrowUp className="w-3.5 h-3.5" /> Skip</span>
              <span className="inline-flex items-center gap-1.5">Yes <Check className="w-3.5 h-3.5" /></span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
