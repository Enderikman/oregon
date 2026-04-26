import { HealthStrip } from "./health-strip";
import { MemoryChatPanel } from "./memory-chat-panel";

export function AdminOverviewPage() {
  return (
    <main className="mx-auto max-w-[1200px] px-6 py-8">
      <header className="mb-6">
        <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
          Cockpit
        </div>
        <h1 className="mt-1 text-[24px] font-normal text-ink">Memory health</h1>
        <p className="mt-1 text-[13px] text-ink-muted">
          The state of the company brain at a glance. Click any number to drill in.
        </p>
      </header>

      <section aria-label="Headline metrics">
        <HealthStrip />
      </section>

      <section aria-label="Ask the memory" className="mt-12">
        <MemoryChatPanel />
      </section>
    </main>
  );
}
