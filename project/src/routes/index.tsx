import { createFileRoute } from "@tanstack/react-router";
import { CockpitPage } from "../components/cockpit/cockpit-page";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Qontext — Memory Steward Cockpit" },
      { name: "description", content: "AI drafts the memory. Humans teach it where it's unsure." },
    ],
  }),
  component: CockpitPage,
});
