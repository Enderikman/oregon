import { createFileRoute } from "@tanstack/react-router";
import { NeuralMapPage } from "@/components/admin/neural-map-page";

export const Route = createFileRoute("/admin/map")({
  head: () => ({
    meta: [
      { title: "Neural Map · Admin · Qontext" },
      {
        name: "description",
        content: "Interactive map of every entity and fact in the company memory.",
      },
    ],
  }),
  component: NeuralMapPage,
});
