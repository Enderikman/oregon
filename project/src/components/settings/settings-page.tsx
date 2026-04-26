import { Bell, Mail, MessageSquare, Volume2, Globe, Palette, Sun, Moon, Monitor } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { toast } from "sonner";
import { useTheme, type Theme } from "@/lib/theme-context";
import { cn } from "@/lib/utils";

type NotificationPrefs = {
  email: boolean;
  push: boolean;
  inApp: boolean;
  sound: boolean;
};

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "pt", label: "Português" },
  { value: "it", label: "Italiano" },
  { value: "nl", label: "Nederlands" },
  { value: "ja", label: "日本語" },
  { value: "zh", label: "中文" },
];

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useLocalStorage<NotificationPrefs>(
    "qontext.settings.notifications",
    { email: true, push: false, inApp: true, sound: true },
  );
  const [language, setLanguage] = useLocalStorage<string>(
    "qontext.settings.language",
    "en",
  );

  const updateNotif = (key: keyof NotificationPrefs, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
    toast.success("Preferences saved");
  };

  const updateLanguage = (value: string) => {
    setLanguage(value);
    const label = LANGUAGES.find((l) => l.value === value)?.label ?? value;
    toast.success(`Language set to ${label}`);
  };

  const themeOptions: Array<{ value: Theme; label: string; icon: typeof Sun }> = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Settings</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Tune how Qontext talks to you and which language it speaks.
        </p>
      </header>

      <section className="mb-6 rounded-2xl border border-border bg-card p-6">
        <div className="mb-5 flex items-center gap-2">
          <Palette className="h-4 w-4 text-accent-ink" />
          <h2 className="text-sm font-medium text-ink">Appearance</h2>
        </div>
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="text-sm text-ink">Theme</p>
            <p className="mt-1 text-xs text-ink-muted">
              Choose how Qontext looks. System follows your device.
            </p>
          </div>
          <div className="inline-flex rounded-lg border border-border bg-surface-2 p-1">
            {themeOptions.map(({ value, label, icon: Icon }) => {
              const active = theme === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setTheme(value);
                    toast.success(`Theme set to ${label}`);
                  }}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs transition-colors",
                    active
                      ? "bg-background text-ink shadow-soft"
                      : "text-ink-muted hover:text-ink",
                  )}
                  aria-pressed={active}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-5 flex items-center gap-2">
          <Bell className="h-4 w-4 text-accent-ink" />
          <h2 className="text-sm font-medium text-ink">Notifications</h2>
        </div>
        <div className="divide-y divide-border">
          <NotifRow
            icon={<Mail className="h-4 w-4 text-ink-muted" />}
            title="Email"
            description="Weekly digest of new questions and resolved conflicts."
            checked={notifications.email}
            onChange={(v) => updateNotif("email", v)}
          />
          <NotifRow
            icon={<Bell className="h-4 w-4 text-ink-muted" />}
            title="Push notifications"
            description="Alert me when a high-impact question needs attention."
            checked={notifications.push}
            onChange={(v) => updateNotif("push", v)}
          />
          <NotifRow
            icon={<MessageSquare className="h-4 w-4 text-ink-muted" />}
            title="In-app banners"
            description="Show subtle nudges inside the cockpit."
            checked={notifications.inApp}
            onChange={(v) => updateNotif("inApp", v)}
          />
          <NotifRow
            icon={<Volume2 className="h-4 w-4 text-ink-muted" />}
            title="Interview sounds"
            description="Play tones during voice interviews."
            checked={notifications.sound}
            onChange={(v) => updateNotif("sound", v)}
          />
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-card p-6">
        <div className="mb-5 flex items-center gap-2">
          <Globe className="h-4 w-4 text-accent-ink" />
          <h2 className="text-sm font-medium text-ink">Language</h2>
        </div>
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="text-sm text-ink">Interface language</p>
            <p className="mt-1 text-xs text-ink-muted">
              Used for the UI, voice prompts, and quiz copy.
            </p>
          </div>
          <Select value={language} onValueChange={updateLanguage}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((l) => (
                <SelectItem key={l.value} value={l.value}>
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>
    </main>
  );
}

function NotifRow({
  icon,
  title,
  description,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-6 py-4 first:pt-0 last:pb-0">
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{icon}</div>
        <div>
          <p className="text-sm text-ink">{title}</p>
          <p className="mt-0.5 text-xs text-ink-muted">{description}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}