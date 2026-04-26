import { createFileRoute, Link } from "@tanstack/react-router";
import { SettingsPage } from "@/components/settings/settings-page";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Qontext" },
      { name: "description", content: "Manage notification and language preferences." },
      { property: "og:title", content: "Settings — Qontext" },
      { property: "og:description", content: "Tune how Qontext talks to you." },
    ],
  }),
  component: SettingsPage,
  errorComponent: ({ error, reset }) => (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl text-ink">Settings unavailable</h1>
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