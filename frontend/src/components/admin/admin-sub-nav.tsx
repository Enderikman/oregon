import { Link } from "@tanstack/react-router";

interface NavItem {
  label: string;
  path: string;
  available: boolean;
  exact: boolean;
}

const items: NavItem[] = [
  { label: "Overview", path: "/admin", available: true, exact: true },
  { label: "Neural Map", path: "/admin/map", available: true, exact: false },
  { label: "Interviews", path: "/admin/interviews", available: true, exact: false },
  { label: "Conflicts", path: "/admin/conflicts", available: true, exact: false },
];

export function AdminSubNav() {
  return (
    <div className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-[1400px] items-center gap-1 px-6">
        <div className="mr-4 font-mono text-[10px] uppercase tracking-wider text-ink-soft">
          Admin
        </div>
        {items.map((item) => {
          if (!item.available) {
            return (
              <span
                key={item.label}
                aria-disabled
                title="Coming in next phase"
                className="cursor-not-allowed px-3 py-3 text-[13px] text-ink-soft"
              >
                {item.label}
              </span>
            );
          }
          return (
            <Link
              key={item.label}
              to={item.path}
              activeOptions={{ exact: item.exact }}
              className="relative px-3 py-3 text-[13px] text-ink-muted transition-colors hover:text-ink"
              activeProps={{
                className:
                  "relative px-3 py-3 text-[13px] text-ink after:absolute after:inset-x-3 after:bottom-[-1px] after:h-[2px] after:bg-[color:var(--accent)]",
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

