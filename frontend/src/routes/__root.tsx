import { Outlet, Link, createRootRoute, HeadContent, Scripts, useRouterState } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { TopNav } from "@/components/shell/top-nav";
import { UserIdGate } from "@/components/shell/user-id-gate";
import { MemoryProvider } from "@/lib/memory-context";
import { ThemeProvider } from "@/lib/theme-context";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">Page not found.</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Go home</Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Qontext — Memory Steward Cockpit" },
      { name: "description", content: "AI drafts the memory. Humans teach it where it's unsure." },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  const themeBootstrap = `(()=>{try{var t=localStorage.getItem('qontext.theme');var d=t==='dark'||((!t||t==='system')&&window.matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;if(d){r.classList.add('dark');r.style.colorScheme='dark';}else{r.style.colorScheme='light';}}catch(e){}})();`;
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function DevResetButton() {
  if (!import.meta.env.DEV) return null;
  const reset = () => {
    ["qontext.v2.resolutions", "qontext.v2.activity", "qontext.v2.sessions"].forEach((k) =>
      localStorage.removeItem(k),
    );
    location.reload();
  };
  return (
    <button
      type="button"
      onClick={reset}
      title="Dev: clear resolutions/activity/sessions and reload"
      className="fixed bottom-3 right-3 z-50 rounded-md border border-border bg-background/80 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-muted shadow-sm backdrop-blur hover:text-ink"
    >
      reset mock
    </button>
  );
}

function RootComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hideNav = pathname.startsWith("/quiz/");
  return (
    <ThemeProvider>
      <MemoryProvider>
        {!hideNav && <TopNav />}
        <Outlet />
        <Toaster />
        <DevResetButton />
        <UserIdGate />
      </MemoryProvider>
    </ThemeProvider>
  );
}
