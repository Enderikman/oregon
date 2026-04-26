import { createFileRoute, Link } from "@tanstack/react-router";
import { HistoryPage } from "@/components/history/history-page";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Interview History — Qontext" },
      { name: "description", content: "Chronological list of past voice interviews and quiz sessions." },
      { property: "og:title", content: "Interview History — Qontext" },
      { property: "og:description", content: "Review every session you've used to teach the memory." },
    ],
  }),
  component: HistoryPage,
  errorComponent: ({ error, reset }) => (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl text-ink">History unavailable</h1>
        <p className="mt-2 text-sm text-ink-muted">{error.message}</p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-full px-4 py-2 text-sm"
            style={{ backgroundColor: "var(--accent)", color: "white" }}
          >
            Retry
          </button>
          <Link to="/" className="rounded-full border border-border px-4 py-2 text-sm text-ink">
            Back to cockpit
          </Link>
        </div>
      </div>
    </div>
  ),
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <div className="text-center">
        <h1 className="text-2xl text-ink">Page not found</h1>
        <Link to="/" className="mt-4 inline-block text-sm text-accent-ink underline">
          Back to cockpit
        </Link>
      </div>
    </div>
  ),
});