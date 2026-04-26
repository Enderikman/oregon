import type { ChatMsg, Question } from "./quiz-types";

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY ?? "";
const MODEL = import.meta.env.VITE_OPENROUTER_MODEL ?? "openai/gpt-4o-mini";
const URL = "https://openrouter.ai/api/v1/chat/completions";

export const useOpenRouter = !!API_KEY;

type Msg = { role: "system" | "user" | "assistant"; content: string };

function buildSystem(q: Question, mode: "clarify" | "draft"): string {
  const parts = [
    mode === "clarify"
      ? "You help a user think through a single quiz question. Be concise and concrete."
      : "You draft a single short answer to a quiz question. Reply with the answer text only — no preamble.",
    `Question: ${q.question}`,
  ];
  if (q.context) parts.push(`Context: ${q.context}`);
  if (q.why) parts.push(`Why we ask: ${q.why}`);
  if (q.clarify) parts.push(`Notes: ${q.clarify}`);
  return parts.join("\n");
}

function headers(): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
    "HTTP-Referer": typeof window !== "undefined" ? window.location.origin : "",
    "X-Title": "Oregon Quiz",
  };
}

export function clarifyFetch(
  body: { question: Question; history: ChatMsg[]; userMessage: string },
  signal: AbortSignal,
): Promise<Response> {
  const messages: Msg[] = [
    { role: "system", content: buildSystem(body.question, "clarify") },
    ...body.history.map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: body.userMessage },
  ];
  return fetch(URL, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ model: MODEL, messages, stream: true }),
    signal,
  });
}

export async function draftFetch(body: {
  question: Question;
  history?: ChatMsg[];
  partial?: string;
}): Promise<{ draft: string }> {
  const messages: Msg[] = [
    { role: "system", content: buildSystem(body.question, "draft") },
    ...(body.history?.map((m) => ({ role: m.role, content: m.content })) ?? []),
  ];
  if (body.partial) {
    messages.push({
      role: "user",
      content: `Continue/refine this partial answer: ${body.partial}`,
    });
  } else {
    messages.push({ role: "user", content: "Write the answer." });
  }
  const resp = await fetch(URL, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ model: MODEL, messages, stream: false }),
  });
  if (!resp.ok) {
    const err = new Error(`OpenRouter ${resp.status}`);
    (err as Error & { status?: number }).status = resp.status;
    throw err;
  }
  const data = await resp.json();
  const draft = data.choices?.[0]?.message?.content ?? "";
  return { draft: typeof draft === "string" ? draft.trim() : "" };
}
