import { createFileRoute } from "@tanstack/react-router";
import { ConflictsPage } from "@/components/admin/conflicts/conflicts-page";

export const Route = createFileRoute("/admin/conflicts")({
  head: () => ({
    meta: [
      { title: "Conflicts · Admin · Qontext" },
      {
        name: "description",
        content:
          "Resolve disputed facts. Side-by-side respondent answers, recommended escalation paths, and one-click actions.",
      },
    ],
  }),
  component: ConflictsPage,
});
