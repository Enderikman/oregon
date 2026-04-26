import { NeuralMap } from "./neural-map/neural-map";

export function NeuralMapPage() {
  return (
    <main className="mx-auto max-w-[1400px] px-6 py-6">
      <header className="mb-4">
        <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
          Cockpit
        </div>
        <h1 className="mt-1 text-[24px] font-normal text-ink">Neural link map</h1>
        <p className="mt-1 text-[13px] text-ink-muted">
          The whole company brain. Click an entity to focus its 2-hop neighborhood.
          Click an edge or fact for the source. Drag the timeline to replay how the brain grew.
        </p>
      </header>
      <NeuralMap />
    </main>
  );
}
