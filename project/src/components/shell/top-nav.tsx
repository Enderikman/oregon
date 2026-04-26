import { Link } from "@tanstack/react-router";
import { api } from "@/lib/api";
import { initials } from "@/lib/format";
import qontextLogo from "@/assets/qontext-logo.png";
import qontextLogoDark from "@/assets/qontext-logo-dark.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, History, LogOut, Sun, Moon, Monitor, Check } from "lucide-react";
import { useTheme, type Theme } from "@/lib/theme-context";

export function TopNav() {
  const user = api.getCurrentUser();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const themeOptions: Array<{ value: Theme; label: string; icon: typeof Sun }> = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center" aria-label="Qontext home">
          <img
            src={resolvedTheme === "dark" ? qontextLogoDark : qontextLogo}
            alt="Qontext"
            className="h-6 w-auto"
          />
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Profile menu"
              className="grid h-9 w-9 place-items-center rounded-full bg-accent-soft text-[12px] font-medium text-accent-ink outline-none ring-offset-background transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              {initials(user.name)}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-ink">{user.name}</span>
              {"email" in user && (user as { email?: string }).email ? (
                <span className="text-xs font-normal text-ink-muted">
                  {(user as { email?: string }).email}
                </span>
              ) : null}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="px-2 pt-1 pb-1 text-[10px] font-medium uppercase tracking-wider text-ink-soft">
              Theme
            </DropdownMenuLabel>
            {themeOptions.map(({ value, label, icon: Icon }) => (
              <DropdownMenuItem
                key={value}
                onSelect={(e) => {
                  e.preventDefault();
                  setTheme(value);
                }}
                className="focus:bg-accent focus:text-white data-[highlighted]:bg-accent data-[highlighted]:text-white"
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
                {theme === value && <Check className="ml-auto h-3.5 w-3.5" />}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              asChild
              className="focus:bg-accent focus:text-white data-[highlighted]:bg-accent data-[highlighted]:text-white"
            >
              <Link to="/history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                History
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              className="focus:bg-accent focus:text-white data-[highlighted]:bg-accent data-[highlighted]:text-white"
            >
              <Link to="/settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-danger focus:bg-danger focus:text-white data-[highlighted]:bg-danger data-[highlighted]:text-white">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
