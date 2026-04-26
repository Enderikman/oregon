import { createFileRoute } from "@tanstack/react-router";
import { AdminOverviewPage } from "@/components/admin/admin-overview-page";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Memory Health · Admin · Qontext" },
      { name: "description", content: "Headline metrics and 7-day trends for the company memory." },
    ],
  }),
  component: AdminOverviewPage,
});
