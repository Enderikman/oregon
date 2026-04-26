import { createFileRoute } from "@tanstack/react-router";
import { InterviewsPage } from "@/components/admin/interviews/interviews-page";

export const Route = createFileRoute("/admin/interviews/")({
  head: () => ({
    meta: [
      { title: "Interviews · Admin · Qontext" },
      {
        name: "description",
        content: "Track every interview session — voice and swipe — with status, accuracy, and conflict signals.",
      },
    ],
  }),
  component: InterviewsPage,
});
