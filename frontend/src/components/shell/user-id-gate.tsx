import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";

export const USER_ID_STORAGE_KEY = "qontext.settings.userId";

export function UserIdGate() {
  const [userId, setUserId] = useLocalStorage<string>(USER_ID_STORAGE_KEY, "");
  const [mounted, setMounted] = useState(false);
  const [draft, setDraft] = useState("");

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  if (userId.trim().length > 0) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = draft.trim();
    if (v.length === 0) return;
    setUserId(v);
  };

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-black/80 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-id-gate-title"
      onKeyDown={(e) => {
        if (e.key === "Escape") e.preventDefault();
      }}
    >
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg"
      >
        <h2
          id="user-id-gate-title"
          className="text-lg font-semibold tracking-tight text-ink"
        >
          Set your user ID
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          Required to identify you with the backend. Stored locally on this
          device.
        </p>
        <div className="mt-5 space-y-2">
          <label
            htmlFor="user-id-gate-input"
            className="block font-mono text-[10px] uppercase tracking-wider text-ink-muted"
          >
            User ID
          </label>
          <Input
            id="user-id-gate-input"
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="e.g. henri-salzer"
          />
        </div>
        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={draft.trim().length === 0}>
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
