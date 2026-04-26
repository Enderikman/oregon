import { createContext, useContext, type ReactElement, type ReactNode } from "react";
import type { ChatMsg } from "@/lib/quiz-types";

export type ContextSummaryComponent = (props: {
  messages: ChatMsg[];
  loading?: boolean;
}) => ReactElement | null;

const Ctx = createContext<ContextSummaryComponent | null>(null);

export function ContextSummaryProvider({
  Component,
  children,
}: {
  Component: ContextSummaryComponent | null;
  children: ReactNode;
}) {
  return <Ctx.Provider value={Component}>{children}</Ctx.Provider>;
}

export function useContextSummaryComponent(): ContextSummaryComponent | null {
  return useContext(Ctx);
}
